'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check, X } from 'lucide-react';
import { ProcessingSpinner } from '@/components/ui/processing-spinner';
import { useReceiptStore } from '@/store/receiptStore';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageSrc: string, aiData?: any) => void;
  onCancel?: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { processReceiptImage, isProcessing } = useReceiptStore();
  const { toast } = useToast();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment', // Use back camera on mobile devices
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setIsCapturing(false);
  }, []);

  const confirmCapture = useCallback(async () => {
    if (capturedImage) {
      try {
        // Extract base64 data from the image
        const base64Data = capturedImage.split(',')[1];
        
        // Call AI analysis
        const aiResult = await processReceiptImage(base64Data);
        
        if (aiResult.success) {
          // Show success message
          toast({
            title: "Receipt analyzed!",
            description: `AI confidence: ${aiResult.confidence}`,
          });
          
          // Pass both image and AI data to parent
          onCapture(capturedImage, aiResult);
        } else {
          // Handle AI failure - still allow manual entry
          toast({
            title: "AI analysis failed",
            description: "Please enter details manually.",
            variant: "destructive",
          });
          
          onCapture(capturedImage);
        }
      } catch (error) {
        console.error('AI processing error:', error);
        toast({
          title: "Could not analyze receipt",
          description: "Please enter details manually.",
          variant: "destructive",
        });
        
        onCapture(capturedImage);
      }
    }
  }, [capturedImage, onCapture, processReceiptImage, toast]);

  const handleCameraReady = useCallback(() => {
    setIsCapturing(true);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-2xl mx-auto">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {capturedImage ? (
              // Show captured image preview
              <img
                src={capturedImage}
                alt="Captured receipt"
                className="w-full h-full object-cover"
              />
            ) : (
              // Show webcam feed
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={handleCameraReady}
                className="w-full h-full object-cover"
                mirrored={false}
              />
            )}
            
            {/* Camera overlay for better UX */}
            {!capturedImage && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50" />
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Position receipt within the frame
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Indicator */}
      {isProcessing && (
        <div className="flex justify-center">
          <ProcessingSpinner />
        </div>
      )}

      {/* Control buttons */}
      <div className="flex space-x-4">
        {capturedImage ? (
          // Show confirm/retake buttons when image is captured
          <>
            <Button
              onClick={retake}
              variant="outline"
              size="lg"
              disabled={isProcessing}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake</span>
            </Button>
            <Button
              onClick={confirmCapture}
              size="lg"
              disabled={isProcessing}
              className="flex items-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>{isProcessing ? 'Analyzing...' : 'Use Photo'}</span>
            </Button>
          </>
        ) : (
          // Show capture button when camera is active
          <>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </Button>
            )}
            <Button
              onClick={capture}
              disabled={!isCapturing}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Capture</span>
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        {capturedImage ? (
          <p>Review your photo and confirm to proceed, or retake if needed.</p>
        ) : (
          <p>
            Position your receipt clearly within the frame and tap capture when ready.
            Make sure the receipt is well-lit and all text is visible.
          </p>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
