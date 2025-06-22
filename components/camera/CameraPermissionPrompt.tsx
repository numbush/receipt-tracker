'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, AlertCircle, RefreshCw, Settings } from 'lucide-react';

interface CameraPermissionPromptProps {
  onPermissionGranted: () => void;
  onPermissionDenied?: () => void;
}

type PermissionState = 'checking' | 'granted' | 'denied' | 'unavailable' | 'error';

const CameraPermissionPrompt: React.FC<CameraPermissionPromptProps> = ({
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkCameraPermission = async () => {
    setPermissionState('checking');
    setErrorMessage('');

    try {
      // Check if navigator.mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionState('unavailable');
        setErrorMessage('Camera access is not supported in this browser.');
        return;
      }

      // Check current permission state
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          if (permission.state === 'granted') {
            setPermissionState('granted');
            onPermissionGranted();
            return;
          } else if (permission.state === 'denied') {
            setPermissionState('denied');
            onPermissionDenied?.();
            return;
          }
        } catch (err) {
          // Permissions API might not be fully supported, continue with getUserMedia
          console.warn('Permissions API not fully supported:', err);
        }
      }

      // Try to access camera directly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop the stream immediately as we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState('granted');
      onPermissionGranted();
      
    } catch (error: any) {
      console.error('Camera permission error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setErrorMessage('Camera access was denied. Please allow camera access to capture receipts.');
        onPermissionDenied?.();
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setPermissionState('unavailable');
        setErrorMessage('No camera found on this device.');
      } else if (error.name === 'NotSupportedError') {
        setPermissionState('unavailable');
        setErrorMessage('Camera access is not supported in this browser.');
      } else {
        setPermissionState('error');
        setErrorMessage(`Camera error: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const requestPermission = async () => {
    await checkCameraPermission();
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const renderContent = () => {
    switch (permissionState) {
      case 'checking':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Checking Camera Access</h3>
              <p className="text-gray-600 mt-2">
                Please wait while we check your camera permissions...
              </p>
            </div>
          </div>
        );

      case 'granted':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Camera className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">Camera Ready</h3>
              <p className="text-gray-600 mt-2">
                Camera access granted. You can now capture receipts.
              </p>
            </div>
          </div>
        );

      case 'denied':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700">Camera Access Denied</h3>
              <p className="text-gray-600 mt-2">
                {errorMessage || 'Camera access is required to capture receipts.'}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  To enable camera access:
                </p>
                <ul className="text-sm text-gray-500 text-left space-y-1">
                  <li>• Click the camera icon in your browser's address bar</li>
                  <li>• Select "Allow" for camera access</li>
                  <li>• Refresh the page if needed</li>
                </ul>
              </div>
            </div>
            <div className="flex space-x-3 justify-center">
              <Button onClick={requestPermission} className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <span>Refresh Page</span>
              </Button>
            </div>
          </div>
        );

      case 'unavailable':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-700">Camera Unavailable</h3>
              <p className="text-gray-600 mt-2">
                {errorMessage || 'Camera is not available on this device or browser.'}
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  You can still add receipts by uploading image files instead.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Try Again</span>
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700">Camera Error</h3>
              <p className="text-gray-600 mt-2">
                {errorMessage || 'An error occurred while accessing the camera.'}
              </p>
            </div>
            <Button onClick={requestPermission} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render anything if permission is already granted
  if (permissionState === 'granted') {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Camera Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraPermissionPrompt;
