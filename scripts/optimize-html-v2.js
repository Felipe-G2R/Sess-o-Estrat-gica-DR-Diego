/**
 * Script para otimizar o content.html - V2
 * Extrai imagens e fontes base64 para arquivos separados
 * Remove código desnecessário de extensões do navegador
 *
 * Execute com: node scripts/optimize-html-v2.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
const FONTS_DIR = path.join(PUBLIC_DIR, 'fonts')
const INPUT_FILE = path.join(PUBLIC_DIR, 'content.html')
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'content-optimized.html')

// Create directories if not exists
;[IMAGES_DIR, FONTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

console.log('🚀 Starting HTML optimization V2...')
console.log(`📁 Input: ${INPUT_FILE}`)

// Read the HTML file
let html = fs.readFileSync(INPUT_FILE, 'utf8')
const originalSize = Buffer.byteLength(html, 'utf8')
console.log(`📊 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)

// Counters
let imageCount = 0
let fontCount = 0
const resourceMap = new Map()

// Extract base64 images
console.log('\n📷 Extracting images...')
const imageRegex = /data:image\/(webp|png|jpeg|jpg|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)/g

html = html.replace(imageRegex, (match, format, base64Data) => {
  const hash = crypto.createHash('md5').update(base64Data.substring(0, 1000)).digest('hex').substring(0, 8)

  if (resourceMap.has(hash)) {
    return resourceMap.get(hash)
  }

  const ext = format === 'svg+xml' ? 'svg' : format
  const filename = `img-${hash}.${ext}`
  const filepath = path.join(IMAGES_DIR, filename)
  const publicPath = `/images/${filename}`

  try {
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length > 500) {
      fs.writeFileSync(filepath, buffer)
      imageCount++
      resourceMap.set(hash, publicPath)
      console.log(`  ✅ ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
      return publicPath
    }
  } catch (err) {
    console.log(`  ⚠️ Failed: ${err.message}`)
  }

  return match
})

// Extract base64 fonts
console.log('\n🔤 Extracting fonts...')
const fontRegex = /data:font\/(woff2?|ttf|otf|eot);base64,([A-Za-z0-9+/=]+)/g
const fontRegex2 = /data:application\/(font-woff2?|x-font-ttf|x-font-otf|vnd\.ms-fontobject);base64,([A-Za-z0-9+/=]+)/g

const extractFont = (match, format, base64Data) => {
  const hash = crypto.createHash('md5').update(base64Data.substring(0, 1000)).digest('hex').substring(0, 8)

  if (resourceMap.has(hash)) {
    return resourceMap.get(hash)
  }

  // Normalize format
  let ext = format.replace('font-', '').replace('x-font-', '').replace('vnd.ms-fontobject', 'eot')
  if (ext === 'woff2') ext = 'woff2'
  else if (ext.includes('woff')) ext = 'woff'
  else if (ext.includes('ttf')) ext = 'ttf'

  const filename = `font-${hash}.${ext}`
  const filepath = path.join(FONTS_DIR, filename)
  const publicPath = `/fonts/${filename}`

  try {
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filepath, buffer)
    fontCount++
    resourceMap.set(hash, publicPath)
    console.log(`  ✅ ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
    return publicPath
  } catch (err) {
    console.log(`  ⚠️ Failed: ${err.message}`)
  }

  return match
}

html = html.replace(fontRegex, extractFont)
html = html.replace(fontRegex2, extractFont)

// Remove browser extension artifacts
console.log('\n🧹 Cleaning up browser extensions...')
const cleanupPatterns = [
  // Plasmo/Monica extension - more aggressive
  /<plasmo-csui[\s\S]*?<\/plasmo-csui>/gi,
  /<template\s+shadowrootmode[^>]*>[\s\S]*?<\/template>/gi,
  /<div[^>]*monica[^>]*>[\s\S]*?<\/div>/gi,
  /<div[^>]*_monica[^>]*>[\s\S]*?<\/div>/gi,
  /<div[^>]*translate="no"[^>]*class="[^"]*monica[^"]*"[\s\S]*?<\/div>/gi,
  // Style blocks with monica/extension classes
  /\.root-container-[\w]+[\s\S]*?\}/g,
  /\.content-root-[\w]+[\s\S]*?\}/g,
  /\.sidebar-[\w]+[\s\S]*?\}/g,
  /\.markdown-font-size[\s\S]*?\}/g,
  // SingleFile comments
  /<!--\s*Page saved with SingleFile[\s\S]*?-->/gi,
  // Empty style tags
  /<style[^>]*>\s*<\/style>/gi,
  // CSS comments
  /\/\*[\s\S]*?\*\//g,
  // Multiple consecutive newlines/spaces
  /\n{3,}/g,
  /\s{2,}/g,
]

cleanupPatterns.forEach((pattern, i) => {
  const before = html.length
  html = html.replace(pattern, ' ')
  const after = html.length
  if (before !== after) {
    console.log(`  ✅ Pattern ${i + 1}: removed ${((before - after) / 1024).toFixed(1)} KB`)
  }
})

// Remove style blocks that contain extension-specific selectors
html = html.replace(/<style[^>]*>([^<]*(?:<(?!\/style)[^<]*)*)<\/style>/gi, (match, content) => {
  // Skip if contains extension patterns
  if (content.includes('monica') ||
      content.includes('plasmo') ||
      content.includes('shadowroot') ||
      content.includes('root-container-') ||
      content.includes('content-root-')) {
    console.log(`  ✅ Removed extension style block (${(content.length / 1024).toFixed(1)} KB)`)
    return ''
  }
  return match
})

// Write optimized HTML
fs.writeFileSync(OUTPUT_FILE, html)
const optimizedSize = Buffer.byteLength(html, 'utf8')

console.log('\n📊 Optimization Results:')
console.log(`  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`)
console.log(`  Images extracted: ${imageCount}`)
console.log(`  Fonts extracted: ${fontCount}`)
console.log(`\n✨ Output: ${OUTPUT_FILE}`)
console.log('\n💡 Next steps:')
console.log('  1. Review content-optimized.html')
console.log('  2. If OK, run: mv public/content.html public/content-backup.html')
console.log('  3. Then run: mv public/content-optimized.html public/content.html')
