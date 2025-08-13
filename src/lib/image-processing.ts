import sharp from 'sharp'
import slugify from 'slugify'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Types for our image processing system
export interface ImageSizes {
  large: { width: 1920, height: 1080 }
  medium: { width: 1080, height: 608 }
  small: { width: 720, height: 405 }
  thumbnail: { width: 300, height: 169 }
}

export interface ProcessedImageResult {
  storageKey: string
  urls: {
    large: string
    medium: string
    small: string
    thumbnail: string
  }
  altText: string
  originalName: string
}

export interface ImageProcessingOptions {
  listingId: string
  propertyTitle: string
  location: string
  imageSubject?: string
  originalFilename: string
  tempKey: string
  index?: number // Add index to ensure unique filenames
}

// Image size configurations
export const IMAGE_SIZES: ImageSizes = {
  large: { width: 1920, height: 1080 },
  medium: { width: 1080, height: 608 },
  small: { width: 720, height: 405 },
  thumbnail: { width: 300, height: 169 }
}

// S3 Client setup (using environment variables)
export const s3Client = new S3Client({
  region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || 'real-estate-hub-michalbabula-2025'

/**
 * Generate SEO-friendly filename from property data
 */
export function generateSEOFilename(propertyTitle: string, imageSubject?: string, index?: number): string {
  const baseSlug = slugify(propertyTitle, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g 
  })
  
  let filename = baseSlug
  if (imageSubject) {
    const subjectSlug = slugify(imageSubject, { lower: true, strict: true })
    filename += `-${subjectSlug}`
  }
  if (index !== undefined) {
    filename += `-${index + 1}`
  }
  
  return filename
}

/**
 * Generate intelligent alt text for SEO
 */
export function generateAltText(propertyTitle: string, location: string, imageSubject?: string): string {
  if (imageSubject) {
    return `View of the ${imageSubject} in the ${propertyTitle} for sale in ${location}`
  }
  return `${propertyTitle} for sale in ${location}`
}

/**
 * Get presigned URL for secure file upload
 */
export async function getPresignedUploadUrl(filename: string, contentType: string): Promise<{
  uploadUrl: string
  key: string
}> {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const key = `incoming/${timestamp}-${randomId}-${filename}`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    // Add CORS headers
    CacheControl: 'max-age=31536000',
    Metadata: {
      'uploaded-at': new Date().toISOString()
    }
  })
  
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  
  return { uploadUrl, key }
}

/**
 * Process and optimize image from temporary storage
 */
export async function processImage(options: ImageProcessingOptions): Promise<ProcessedImageResult> {
  const { listingId, propertyTitle, location, imageSubject, originalFilename, tempKey, index } = options
  
  // Generate SEO-friendly base filename with index to ensure uniqueness
  const baseFilename = generateSEOFilename(propertyTitle, imageSubject, index)
  const altText = generateAltText(propertyTitle, location, imageSubject)
  
  // Download the temporary image
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: tempKey
  })
  
  const tempObject = await s3Client.send(getCommand)
  const imageBuffer = await streamToBuffer(tempObject.Body as any)
  
  // Process image into multiple sizes
  const urls: ProcessedImageResult['urls'] = {
    large: '',
    medium: '',
    small: '',
    thumbnail: ''
  }
  
  const storageKey = `listings/${listingId}/${baseFilename}`
  
  // Process each size
  for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
    const sizeKey = `${storageKey}-${sizeName}.webp`
    
    // Resize and optimize image
    const processedBuffer = await sharp(imageBuffer)
      .resize(dimensions.width, dimensions.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85, effort: 6 })
      .toBuffer()
    
    // Upload processed image
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: sizeKey,
      Body: processedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'max-age=31536000',
      Metadata: {
        'listing-id': listingId,
        'original-name': originalFilename,
        'size': sizeName,
        'alt-text': altText,
        'processed-at': new Date().toISOString()
      }
    })
    
    await s3Client.send(putCommand)
    
    // Generate public URL (adjust based on your S3 setup)
    urls[sizeName as keyof typeof urls] = `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || process.env.AWS_REGION}.amazonaws.com/${sizeKey}`
  }
  
  // Clean up temporary file
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: tempKey
  })
  await s3Client.send(deleteCommand)
  
  return {
    storageKey,
    urls,
    altText,
    originalName: originalFilename
  }
}

/**
 * Helper function to convert stream to buffer
 */
async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

/**
 * Generate image sitemap XML for SEO
 */
export function generateImageSitemap(images: Array<{
  url_large: string
  altText: string
  propertyUrl: string
}>): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `
  <url>
    <loc>${image.propertyUrl}</loc>
    <image:image>
      <image:loc>${image.url_large}</image:loc>
      <image:title>${escapeXml(image.altText)}</image:title>
    </image:image>
  </url>`).join('')}
</urlset>`
  
  return xml
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&#39;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

/**
 * Generate structured data (JSON-LD) for a property with images
 */
export function generatePropertyStructuredData(property: {
  title: string
  description: string
  price: number
  currency: string
  images: Array<{ url_large: string; altText: string }>
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "description": property.description,
    "url": property.url,
    "image": property.images.map(img => img.url_large),
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency,
      "availability": "https://schema.org/InStock"
    },
    "brand": {
      "@type": "Organization",
      "name": "Global Real Estate Platform"
    }
  }
}
