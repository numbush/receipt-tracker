import ImageUploadTest from '@/components/test/ImageUploadTest';
import { PageLayout } from '@/components/layout/PageLayout';

export default function TestUploadPage() {
  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Image Upload Test</h1>
          <p className="text-gray-600 mt-2">
            Test the cloud storage and image optimization functionality
          </p>
        </div>
        
        <ImageUploadTest />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Features Tested:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• File validation (type and size)</li>
            <li>• Image optimization with Sharp</li>
            <li>• Upload to Vercel Blob Storage</li>
            <li>• Multiple size generation (thumbnail, medium, large)</li>
            <li>• WebP format conversion for better compression</li>
            <li>• Responsive image display</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Setup Required:</h3>
          <p className="text-yellow-800 text-sm">
            Make sure to set your <code>BLOB_READ_WRITE_TOKEN</code> in the .env.local file 
            with your Vercel Blob Storage token for the upload to work properly.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
