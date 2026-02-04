/**
 * Script para otimizar o content.html
 * Extrai imagens base64 para arquivos separados
 * Remove código desnecessário de extensões do navegador
 *
 * Execute com: node scripts/optimize-html.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')
const INPUT_FILE = path.join(PUBLIC_DIR, 'content.html')
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'content-optimized.html')

// Create images directory if not exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

console.log('🚀 Starting HTML optimization...')
console.log(`📁 Input: ${INPUT_FILE}`)

// Read the HTML file
let html = fs.readFileSync(INPUT_FILE, 'utf8')
const originalSize = Buffer.byteLength(html, 'utf8')
console.log(`📊 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)

// Counter for extracted images
let imageCount = 0
const imageMap = new Map()

// Extract base64 images from img tags and CSS
const base64Regex = /data:image\/(webp|png|jpeg|jpg|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)/g

html = html.replace(base64Regex, (match, format, base64Data) => {
  // Create hash for deduplication
  const hash = crypto.createHash('md5').update(base64Data.substring(0, 1000)).digest('hex').substring(0, 8)

  // Check if already extracted
  if (imageMap.has(hash)) {
    return imageMap.get(hash)
  }

  // Determine file extension
  const ext = format === 'svg+xml' ? 'svg' : format
  const filename = `img-${hash}.${ext}`
  const filepath = path.join(IMAGES_DIR, filename)
  const publicPath = `/images/${filename}`

  try {
    // Decode and save the image
    const buffer = Buffer.from(base64Data, 'base64')

    // Only save if image is larger than 500 bytes (skip tiny icons)
    if (buffer.length > 500) {
      fs.writeFileSync(filepath, buffer)
      imageCount++
      imageMap.set(hash, publicPath)
      console.log(`  ✅ Extracted: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
      return publicPath
    }
  } catch (err) {
    console.log(`  ⚠️ Failed to extract image: ${err.message}`)
  }

  return match // Keep original if failed
})

// Remove browser extension artifacts
const cleanupPatterns = [
  // Plasmo/Monica extension
  /<plasmo-csui[\s\S]*?<\/plasmo-csui>/gi,
  /<div[^>]*monica[^>]*>[\s\S]*?<\/div>/gi,
  /<div[^>]*translate="no"[^>]*>[\s\S]*?<\/div>/gi,
  // SingleFile comments
  /<!--\s*Page saved with SingleFile[\s\S]*?-->/gi,
  // Empty style tags
  /<style>\s*<\/style>/gi,
  // Multiple consecutive newlines
  /\n{3,}/g,
]

cleanupPatterns.forEach(pattern => {
  html = html.replace(pattern, '\n')
})

// Remove inline styles that are likely from extensions
html = html.replace(/<style[^>]*sf-hidden[^>]*>[\s\S]*?<\/style>/gi, '')

// Write optimized HTML
fs.writeFileSync(OUTPUT_FILE, html)
const optimizedSize = Buffer.byteLength(html, 'utf8')

console.log('\n📊 Optimization Results:')
console.log(`  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  Reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`)
console.log(`  Images extracted: ${imageCount}`)
console.log(`\n✨ Output: ${OUTPUT_FILE}`)
console.log('\n💡 To use the optimized version, rename content-optimized.html to content.html')
