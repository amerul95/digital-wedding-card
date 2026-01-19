/**
 * Thumbnail Storage Utility
 * 
 * This utility handles saving thumbnails to storage.
 * Currently uses local file system, but can be easily switched to S3/Cloudinary.
 * 
 * For production, update the saveThumbnail function to use your cloud storage.
 */

import fs from 'fs/promises'
import path from 'path'

// Storage configuration
const STORAGE_TYPE = process.env.THUMBNAIL_STORAGE_TYPE || 'local' // 'local' | 's3' | 'cloudinary'
const LOCAL_STORAGE_PATH = process.env.THUMBNAIL_STORAGE_PATH || path.join(process.cwd(), 'public', 'thumbnails')

/**
 * Ensure the storage directory exists (for local storage)
 */
export async function ensureStorageDirectory(): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true })
    } catch (error) {
      console.error('[ThumbnailStorage] Error creating storage directory:', error)
      throw error
    }
  }
}

/**
 * Save thumbnail image to storage
 * 
 * @param imageBuffer - The image buffer (PNG/JPEG)
 * @param filename - The filename (e.g., "template-123.png")
 * @returns The URL/path to access the thumbnail
 */
export async function saveThumbnail(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  await ensureStorageDirectory()

  if (STORAGE_TYPE === 'local') {
    // Save to local file system
    const filePath = path.join(LOCAL_STORAGE_PATH, filename)
    await fs.writeFile(filePath, imageBuffer)
    
    // Return the public URL path
    return `/thumbnails/${filename}`
  } else if (STORAGE_TYPE === 's3') {
    // TODO: Implement S3 upload
    // Example:
    // const s3 = new AWS.S3()
    // await s3.putObject({
    //   Bucket: process.env.S3_BUCKET_NAME,
    //   Key: `thumbnails/${filename}`,
    //   Body: imageBuffer,
    //   ContentType: 'image/png'
    // })
    // return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/thumbnails/${filename}`
    throw new Error('S3 storage not yet implemented. Set THUMBNAIL_STORAGE_TYPE=local')
  } else if (STORAGE_TYPE === 'cloudinary') {
    // TODO: Implement Cloudinary upload
    throw new Error('Cloudinary storage not yet implemented. Set THUMBNAIL_STORAGE_TYPE=local')
  }

  throw new Error(`Unknown storage type: ${STORAGE_TYPE}`)
}

/**
 * Delete thumbnail from storage
 */
export async function deleteThumbnail(filename: string): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    const filePath = path.join(LOCAL_STORAGE_PATH, filename)
    try {
      await fs.unlink(filePath)
    } catch (error: any) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  } else if (STORAGE_TYPE === 's3') {
    // TODO: Implement S3 delete
    throw new Error('S3 storage not yet implemented')
  } else if (STORAGE_TYPE === 'cloudinary') {
    // TODO: Implement Cloudinary delete
    throw new Error('Cloudinary storage not yet implemented')
  }
}

/**
 * Get thumbnail URL (for reading)
 */
export function getThumbnailUrl(filename: string): string {
  if (STORAGE_TYPE === 'local') {
    return `/thumbnails/${filename}`
  } else if (STORAGE_TYPE === 's3') {
    // TODO: Return S3 URL
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/thumbnails/${filename}`
  } else if (STORAGE_TYPE === 'cloudinary') {
    // TODO: Return Cloudinary URL
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/thumbnails/${filename}`
  }
  
  return `/thumbnails/${filename}`
}
