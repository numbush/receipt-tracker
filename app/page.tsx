'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CameraPageLayout } from '@/components/layout/PageLayout';
import CameraCapture from '@/components/camera/CameraCapture';
import CameraPermissionPrompt from '@/components/camera/CameraPermissionPrompt';
import { ReceiptForm } from '@/components/receipt/ReceiptForm';
import { useReceiptStore } from '@/store/receiptStore';
import { ReceiptFormData, Receipt } from '@/types/receipt';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, FileText } from 'lucide-react';

type CaptureStep = 'choose' | 'camera' | 'form' | 'success';

export default function CapturePage() {
  const router = useRouter();
  const { addReceipt, setLoading, setError, isLoading } = useReceiptStore();
  
  const [currentStep, setCurrentStep] = useState<CaptureStep>('choose');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [aiData, setAiData] = useState<any>(null);

  // Handle camera permission
  const handlePermissionGranted = useCallback(() => {
    setHasPermission(true);
    setCurrentStep('camera');
  }, []);

  const handlePermissionDenied = useCallback(() => {
    setHasPermission(false);
    // Could add toast notification here if needed
    console.warn("Camera permission denied");
  }, []);

  // Handle image capture
  const handleImageCapture = useCallback((imageSrc: string, aiData?: any) => {
    setCapturedImage(imageSrc);
    setAiData(aiData);
    setCurrentStep('form');
  }, []);

  // Handle form submission
  const handleFormSubmit = useCallback(async (formData: ReceiptFormData) => {
    if (!capturedImage) return;

    setLoading(true);
    setError(null);

    try {
      // Convert base64 image to blob for upload
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create form data for upload
      const uploadFormData = new FormData();
      uploadFormData.append('image', blob, 'receipt.jpg');
      uploadFormData.append('storeName', formData.storeName);
      uploadFormData.append('amount', formData.amount);
      uploadFormData.append('date', formData.date);

      // Upload to API
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload receipt');
      }

      const result = await uploadResponse.json();
      
      // Create receipt object
      const newReceipt: Receipt = {
        _id: result._id,
        storeName: formData.storeName,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        imageUrl: result.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to store
      addReceipt(newReceipt);
      
      setCurrentStep('success');
      
      console.log("Receipt saved successfully");

    } catch (error) {
      console.error('Error saving receipt:', error);
      setError(error instanceof Error ? error.message : 'Failed to save receipt');
      
      alert('Failed to save receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [capturedImage, addReceipt, setLoading, setError]);

  // Handle navigation
  const handleViewReceipts = useCallback(() => {
    router.push('/receipts');
  }, [router]);

  const handleCaptureAnother = useCallback(() => {
    setCapturedImage(null);
    setCurrentStep('choose');
  }, []);

  const handleStartCamera = useCallback(() => {
    if (hasPermission === null) {
      // Check permission first
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setHasPermission(true);
          setCurrentStep('camera');
        })
        .catch(() => {
          setHasPermission(false);
        });
    } else if (hasPermission) {
      setCurrentStep('camera');
    }
  }, [hasPermission]);

  const handleCancel = useCallback(() => {
    setCurrentStep('choose');
    setCapturedImage(null);
  }, []);

  // Render different steps
  const renderContent = () => {
    switch (currentStep) {
      case 'choose':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-6">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Add a Receipt</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose how you'd like to add your receipt. You can take a photo 
                    with your camera or upload an existing image.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                onClick={handleStartCamera}
                size="lg"
                className="h-auto py-6 flex flex-col items-center space-y-2"
              >
                <Camera className="h-8 w-8" />
                <div>
                  <div className="font-semibold">Take Photo</div>
                  <div className="text-sm opacity-90">Use your camera</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-6 flex flex-col items-center space-y-2"
                disabled
              >
                <Upload className="h-8 w-8" />
                <div>
                  <div className="font-semibold">Upload Image</div>
                  <div className="text-sm opacity-70">Coming soon</div>
                </div>
              </Button>
            </div>
          </div>
        );

      case 'camera':
        if (hasPermission === false) {
          return (
            <CameraPermissionPrompt
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          );
        }

        return (
          <CameraCapture
            onCapture={handleImageCapture}
            onCancel={handleCancel}
          />
        );

      case 'form':
        return (
          <div className="space-y-6">
            {capturedImage && (
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Captured receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <ReceiptForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              aiData={aiData}
            />
          </div>
        );

      case 'success':
        return (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-green-100 p-6 mb-4">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receipt Saved!</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Your receipt has been successfully saved and is now available in your receipts list.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleCaptureAnother} variant="outline">
                  Add Another
                </Button>
                <Button onClick={handleViewReceipts}>
                  View All Receipts
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <CameraPageLayout>
      {renderContent()}
    </CameraPageLayout>
  );
}
