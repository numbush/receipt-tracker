import { put } from '@vercel/blob';
import sharp from 'sharp';

export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  format: string;
}

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
  format: 'webp'
};

/**
 * Validates if the file is a supported image type
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
    };
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { valid: true };
}

/**
 * Optimizes an image using Sharp
 */
export async function optimizeImage(
  buffer: Buffer,
  options: ImageUploadOptions = {}
): Promise<{ buffer: Buffer; metadata: { width: number; height: number; format: string; size: number } }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let sharpInstance = sharp(buffer);
  
  // Get original metadata
  const metadata = await sharpInstance.metadata();
  
  // Resize if needed
  if (metadata.width && metadata.height) {
    if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
      sharpInstance = sharpInstance.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }
  
  // Convert format and optimize
  let optimizedBuffer: Buffer;
  switch (opts.format) {
    case 'jpeg':
      optimizedBuffer = await sharpInstance
        .jpeg({ quality: opts.quality, progressive: true })
        .toBuffer();
      break;
    case 'png':
      optimizedBuffer = await sharpInstance
        .png({ quality: opts.quality, progressive: true })
        .toBuffer();
      break;
    case 'webp':
    default:
      optimizedBuffer = await sharpInstance
        .webp({ quality: opts.quality })
        .toBuffer();
      break;
  }
  
  // Get final metadata
  const finalMetadata = await sharp(optimizedBuffer).metadata();
  
  return {
    buffer: optimizedBuffer,
    metadata: {
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
      format: opts.format,
      size: optimizedBuffer.length
    }
  };
}

/**
 * Uploads an optimized image to Vercel Blob Storage
 */
export async function uploadImageToBlob(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Optimize image
  const { buffer: optimizedBuffer, metadata } = await optimizeImage(buffer, options);

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = options.format || 'webp';
  const filename = `receipt_${timestamp}_${randomString}.${fileExtension}`;

  // Upload to Vercel Blob
  const blob = await put(filename, optimizedBuffer, {
    access: 'public',
    contentType: `image/${fileExtension}`,
  });

  return {
    url: blob.url,
    filename,
    size: metadata.size,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format
  };
}

/**
 * Uploads multiple images to Vercel Blob Storage
 */
export async function uploadMultipleImages(
  files: File[],
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map(file => uploadImageToBlob(file, options));
  return Promise.all(uploadPromises);
}

/**
 * Generates different sizes of an image (thumbnail, medium, large)
 */
export async function generateImageSizes(
  file: File
): Promise<{
  thumbnail: ImageUploadResult;
  medium: ImageUploadResult;
  large: ImageUploadResult;
}> {
  const [thumbnail, medium, large] = await Promise.all([
    uploadImageToBlob(file, { maxWidth: 200, maxHeight: 200, quality: 80 }),
    uploadImageToBlob(file, { maxWidth: 600, maxHeight: 600, quality: 85 }),
    uploadImageToBlob(file, { maxWidth: 1200, maxHeight: 1200, quality: 90 })
  ]);

  return { thumbnail, medium, large };
}
