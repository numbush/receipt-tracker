'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadResult {
  imageUrl: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  format: string;
  thumbnail?: {
    url: string;
    size: number;
  };
  medium?: {
    url: string;
    size: number;
  };
  large?: {
    url: string;
    size: number;
  };
}

export default function ImageUploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generateSizes, setGenerateSizes] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (generateSizes) {
        formData.append('generateSizes', 'true');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Image Upload Test</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-input">Select Image File</Label>
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="generate-sizes"
              checked={generateSizes}
              onChange={(e) => setGenerateSizes(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="generate-sizes">
              Generate multiple sizes (thumbnail, medium, large)
            </Label>
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              Error: {error}
            </div>
          )}
        </div>
      </Card>

      {uploadResult && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upload Result</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Filename:</strong> {uploadResult.filename}
              </div>
              <div>
                <strong>Format:</strong> {uploadResult.format}
              </div>
              <div>
                <strong>Size:</strong> {formatFileSize(uploadResult.size)}
              </div>
              <div>
                <strong>Dimensions:</strong> {uploadResult.width} × {uploadResult.height}
              </div>
            </div>

            <div>
              <strong>Main Image:</strong>
              <div className="mt-2">
                <img 
                  src={uploadResult.imageUrl} 
                  alt="Uploaded receipt" 
                  className="max-w-md rounded border shadow-sm"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                URL: {uploadResult.imageUrl}
              </div>
            </div>

            {uploadResult.thumbnail && uploadResult.medium && uploadResult.large && (
              <div>
                <strong>Generated Sizes:</strong>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <div className="text-sm font-medium">Thumbnail</div>
                    <img 
                      src={uploadResult.thumbnail.url} 
                      alt="Thumbnail" 
                      className="w-full max-w-[200px] rounded border"
                    />
                    <div className="text-xs text-gray-500">
                      {formatFileSize(uploadResult.thumbnail.size)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Medium</div>
                    <img 
                      src={uploadResult.medium.url} 
                      alt="Medium" 
                      className="w-full max-w-[300px] rounded border"
                    />
                    <div className="text-xs text-gray-500">
                      {formatFileSize(uploadResult.medium.size)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Large</div>
                    <img 
                      src={uploadResult.large.url} 
                      alt="Large" 
                      className="w-full max-w-[400px] rounded border"
                    />
                    <div className="text-xs text-gray-500">
                      {formatFileSize(uploadResult.large.size)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
