'use client';

import React, { useState } from 'react';
import CameraPermissionPrompt from './CameraPermissionPrompt';
import CameraCapture from './CameraCapture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

const CameraTest: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handlePermissionGranted = () => {
    setHasPermission(true);
  };

  const handlePermissionDenied = () => {
    setHasPermission(false);
    setShowCamera(false);
  };

  const handleStartCamera = () => {
    setShowCamera(true);
    setCapturedImage(null);
  };

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const handleCancel = () => {
    setShowCamera(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-6 h-6" />
            <span>Camera Component Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Test the camera components for capturing receipt images. This demonstrates
            the camera permission handling and image capture functionality.
          </p>
          
          {!hasPermission && (
            <CameraPermissionPrompt
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          )}

          {hasPermission && !showCamera && !capturedImage && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Camera className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">Camera Ready!</h3>
                <p className="text-gray-600 mt-2">
                  Camera access is granted. You can now capture receipt images.
                </p>
              </div>
              <Button onClick={handleStartCamera} size="lg" className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Start Camera</span>
              </Button>
            </div>
          )}

          {hasPermission && showCamera && (
            <CameraCapture
              onCapture={handleCapture}
              onCancel={handleCancel}
            />
          )}

          {capturedImage && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Captured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={capturedImage}
                      alt="Captured receipt"
                      className="w-full max-w-md mx-auto rounded-lg border"
                    />
                    <div className="text-center space-x-4">
                      <Button onClick={handleStartCamera} variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Another
                      </Button>
                      <Button onClick={handleReset} variant="outline">
                        Reset Test
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      <p>Image captured successfully! In a real application, this would be processed and saved.</p>
                      <p className="mt-1">Image size: {Math.round(capturedImage.length / 1024)} KB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraTest;
