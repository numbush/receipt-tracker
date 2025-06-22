# Image Upload & Storage Implementation

## Overview

This implementation provides cloud-based image storage and optimization for receipt images using Vercel Blob Storage and Sharp image processing.

## Features

### ✅ Cloud Storage
- **Vercel Blob Storage**: Secure, scalable cloud storage
- **Public URLs**: Direct access to uploaded images
- **Automatic cleanup**: Built-in garbage collection

### ✅ Image Optimization
- **Sharp Processing**: High-performance image optimization
- **Format Conversion**: Automatic WebP conversion for better compression
- **Resizing**: Intelligent resizing while maintaining aspect ratio
- **Quality Control**: Configurable compression levels

### ✅ Multiple Image Sizes
- **Thumbnail**: 200x200px for quick previews
- **Medium**: 600x600px for general display
- **Large**: 1200x1200px for detailed viewing

### ✅ Validation & Security
- **File Type Validation**: Only JPEG, PNG, and WebP allowed
- **Size Limits**: Maximum 10MB file size
- **Secure Upload**: Server-side validation and processing

## Files Created/Modified

### Core Implementation
1. **`lib/imageUpload.ts`** - Main image upload utility
2. **`app/api/upload/route.ts`** - Updated API endpoint
3. **`.env.local`** - Added Blob Storage configuration

### Testing Components
4. **`components/test/ImageUploadTest.tsx`** - Test component
5. **`app/test-upload/page.tsx`** - Test page
6. **`components/layout/Navigation.tsx`** - Added test navigation

## Setup Instructions

### 1. Environment Variables
Add to your `.env.local` file:
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 2. Get Vercel Blob Token
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Create a new Blob Storage token
5. Copy the token to your `.env.local`

### 3. Dependencies
Already installed:
- `@vercel/blob` - Vercel Blob Storage client
- `sharp` - Image processing library

## API Usage

### Single Image Upload
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// Returns: { success: true, data: { imageUrl, filename, size, width, height, format } }
```

### Multiple Sizes Upload
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('generateSizes', 'true');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// Returns: { success: true, data: { thumbnail, medium, large, imageUrl, ... } }
```

## Utility Functions

### `validateImageFile(file: File)`
Validates file type and size before upload.

### `optimizeImage(buffer: Buffer, options: ImageUploadOptions)`
Processes and optimizes image using Sharp.

### `uploadImageToBlob(file: File, options: ImageUploadOptions)`
Uploads a single optimized image to Vercel Blob Storage.

### `generateImageSizes(file: File)`
Creates thumbnail, medium, and large versions of an image.

## Configuration Options

```typescript
interface ImageUploadOptions {
  maxWidth?: number;      // Default: 1200
  maxHeight?: number;     // Default: 1200
  quality?: number;       // Default: 85
  format?: 'jpeg' | 'png' | 'webp'; // Default: 'webp'
}
```

## Testing

### Manual Testing
1. Navigate to `/test-upload`
2. Select an image file
3. Choose single or multiple sizes upload
4. Verify upload success and image display

### Test Cases
- ✅ Valid image upload (JPEG, PNG, WebP)
- ✅ Invalid file type rejection
- ✅ File size limit enforcement
- ✅ Image optimization and format conversion
- ✅ Multiple sizes generation
- ✅ Cloud storage URL generation

## Integration with Receipt System

### Receipt Model Updates
The receipt model should be updated to store image URLs:

```typescript
interface Receipt {
  // ... existing fields
  imageUrl?: string;
  imageThumbnail?: string;
  imageMedium?: string;
  imageLarge?: string;
}
```

### Receipt Form Integration
Update the receipt form to use the new upload API:

```typescript
// In ReceiptForm component
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('generateSizes', 'true');
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  if (result.success) {
    // Update form state with image URLs
    setImageUrl(result.data.imageUrl);
    setImageThumbnail(result.data.thumbnail?.url);
    // ... etc
  }
};
```

## Performance Considerations

### Image Optimization
- **WebP Format**: ~30% smaller than JPEG with same quality
- **Progressive Loading**: Use thumbnail → medium → large progression
- **Lazy Loading**: Implement for image lists

### Caching
- **CDN**: Vercel Blob Storage includes CDN
- **Browser Caching**: Images cached automatically
- **Preloading**: Consider preloading critical images

## Security Features

### Server-Side Validation
- File type checking
- Size limit enforcement
- Buffer processing (no direct file system access)

### Access Control
- Public read access for display
- Authenticated upload only
- No direct file system exposure

## Error Handling

### Common Errors
- Invalid file type
- File too large
- Network upload failure
- Blob storage quota exceeded

### Error Responses
```json
{
  "success": false,
  "error": "File size too large. Maximum size is 10MB."
}
```

## Future Enhancements

### Potential Improvements
1. **Image Metadata Extraction**: EXIF data for receipts
2. **OCR Integration**: Text extraction from images
3. **Batch Upload**: Multiple files at once
4. **Image Editing**: Crop, rotate, enhance
5. **Progressive Web App**: Offline upload queue

### Monitoring
- Upload success rates
- Image optimization metrics
- Storage usage tracking
- Performance monitoring

## Troubleshooting

### Common Issues
1. **Missing Blob Token**: Check `.env.local` configuration
2. **Upload Failures**: Verify network connectivity
3. **Image Not Displaying**: Check CORS and URL accessibility
4. **Large File Uploads**: Ensure proper timeout settings

### Debug Mode
Enable detailed logging by adding to your environment:
```env
DEBUG=vercel:blob
```

## Conclusion

This implementation provides a robust, scalable solution for image storage and optimization in the receipt tracker application. The combination of Vercel Blob Storage and Sharp processing ensures optimal performance, security, and user experience.
