/**
 * Script para otimizar o content.html - V3
 * Versão mais cuidadosa que preserva o conteúdo principal
 *
 * Execute com: node scripts/optimize-html-v3.js
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

console.log('🚀 Starting HTML optimization V3...')
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

// Clean up ONLY browser extension artifacts (carefully)
console.log('\n🧹 Cleaning up browser extensions (careful mode)...')

// Remove plasmo-csui completely (this is Monica AI extension)
const plasmoRegex = /<plasmo-csui[^>]*>[\s\S]*?<\/plasmo-csui>/gi
const plasmoMatches = html.match(plasmoRegex) || []
console.log(`  Found ${plasmoMatches.length} plasmo-csui elements to remove`)
html = html.replace(plasmoRegex, '')

// Remove SingleFile comments
html = html.replace(/<!--\s*Page saved with SingleFile[\s\S]*?-->/gi, '')

// Remove empty style and script tags
html = html.replace(/<style[^>]*>\s*<\/style>/gi, '')
html = html.replace(/<script[^>]*>\s*<\/script>/gi, '')

// Normalize whitespace (but keep structure)
html = html.replace(/\n{3,}/g, '\n\n')

// Write optimized HTML
fs.writeFileSync(OUTPUT_FILE, html)
const optimizedSize = Buffer.byteLength(html, 'utf8')

console.log('\n📊 Optimization Results:')
console.log(`  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`)
console.log(`  Images extracted: ${imageCount}`)
console.log(`  Fonts extracted: ${fontCount}`)

// Verify content integrity
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
const bodyContent = bodyMatch ? bodyMatch[1] : html
const elementorCount = (bodyContent.match(/elementor/gi) || []).length
const buttonCount = (bodyContent.match(/elementor-button/gi) || []).length

console.log(`\n🔍 Content verification:`)
console.log(`  Elementor references: ${elementorCount}`)
console.log(`  Buttons found: ${buttonCount}`)

if (elementorCount < 10 || buttonCount < 1) {
  console.log(`\n⚠️  WARNING: Content may be incomplete! Check the output file.`)
}

console.log(`\n✨ Output: ${OUTPUT_FILE}`)
