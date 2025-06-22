"use client";

import React, { useState } from 'react';
import { ReceiptForm } from '@/components/receipt/ReceiptForm';
import { ReceiptFormData } from '@/types/receipt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReceiptFormTest() {
  const [submittedData, setSubmittedData] = useState<ReceiptFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ReceiptFormData) => {
    console.log('Form submitted with data:', data);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmittedData(data);
    setIsLoading(false);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    setSubmittedData(null);
  };

  const resetTest = () => {
    setSubmittedData(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Receipt Form Test</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div>
          <ReceiptForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>

        {/* Results */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Form Results</CardTitle>
            </CardHeader>
            <CardContent>
              {submittedData ? (
                <div className="space-y-2">
                  <p><strong>Store Name:</strong> {submittedData.storeName}</p>
                  <p><strong>Amount:</strong> ${parseFloat(submittedData.amount).toFixed(2)}</p>
                  <p><strong>Date:</strong> {new Date(submittedData.date).toLocaleDateString()}</p>
                  <button 
                    onClick={resetTest}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reset Test
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Submit the form to see results here</p>
              )}
            </CardContent>
          </Card>

          {/* Test Instructions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Currency Input:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Shows formatted currency when not focused</li>
                <li>Shows raw number when focused</li>
                <li>Only allows numeric input</li>
                <li>Right-aligned text</li>
              </ul>
              
              <p><strong>Validation Tests:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Try submitting empty fields</li>
                <li>Try entering negative amounts</li>
                <li>Try future dates</li>
                <li>Try very old dates (&gt;1 year ago)</li>
                <li>Try store names with less than 2 characters</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
