import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToBlob, generateImageSizes, validateImageFile } from '@/lib/imageUpload';

// POST /api/upload - Handle image upload with cloud storage and optimization
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const generateSizes = formData.get('generateSizes') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file using the utility function
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    let result;

    if (generateSizes) {
      // Generate multiple sizes (thumbnail, medium, large)
      const imageSizes = await generateImageSizes(file);
      result = {
        thumbnail: imageSizes.thumbnail,
        medium: imageSizes.medium,
        large: imageSizes.large,
        // Use medium as the default image
        imageUrl: imageSizes.medium.url,
        filename: imageSizes.medium.filename,
        size: imageSizes.medium.size,
        width: imageSizes.medium.width,
        height: imageSizes.medium.height,
        format: imageSizes.medium.format,
      };
    } else {
      // Upload single optimized image
      const uploadResult = await uploadImageToBlob(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 85,
        format: 'webp'
      });

      result = {
        imageUrl: uploadResult.url,
        filename: uploadResult.filename,
        size: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET /api/upload - Get upload information (optional endpoint for testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Upload endpoint is working',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: '10MB',
  });
}
