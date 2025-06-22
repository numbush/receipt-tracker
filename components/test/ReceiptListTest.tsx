'use client';

import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { ReceiptSummary } from '@/components/receipt/ReceiptSummary';
import { ReceiptGrid } from '@/components/receipt/ReceiptGrid';
import { useReceiptStore } from '@/store/receiptStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample receipt data for testing
const sampleReceipts: Receipt[] = [
  {
    _id: '1',
    imageUrl: 'https://via.placeholder.com/300x400/f0f0f0/666?text=Receipt+1',
    storeName: 'Grocery Store',
    amount: 45.67,
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '2',
    imageUrl: 'https://via.placeholder.com/300x400/f0f0f0/666?text=Receipt+2',
    storeName: 'Coffee Shop',
    amount: 12.50,
    date: new Date('2024-01-16'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    _id: '3',
    imageUrl: 'https://via.placeholder.com/300x400/f0f0f0/666?text=Receipt+3',
    storeName: 'Gas Station',
    amount: 78.90,
    date: new Date('2024-01-17'),
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    _id: '4',
    imageUrl: 'https://via.placeholder.com/300x400/f0f0f0/666?text=Receipt+4',
    storeName: 'Restaurant',
    amount: 89.25,
    date: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    _id: '5',
    imageUrl: 'https://via.placeholder.com/300x400/f0f0f0/666?text=Receipt+5',
    storeName: 'Pharmacy',
    amount: 23.45,
    date: new Date('2024-01-19'),
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

export function ReceiptListTest() {
  const { receipts, setReceipts, isLoading, setLoading } = useReceiptStore();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const loadSampleData = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setReceipts(sampleReceipts);
      setLoading(false);
    }, 1000);
  };

  const clearData = () => {
    setReceipts([]);
    setSelectedReceipt(null);
  };

  const handleViewDetails = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleAddReceipt = () => {
    alert('Add receipt functionality would open the receipt form');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Receipt List & Summary Test</h1>
        <div className="flex gap-2">
          <Button onClick={loadSampleData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load Sample Data'}
          </Button>
          <Button onClick={clearData} variant="outline">
            Clear Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <ReceiptSummary />
      </div>

      {/* Receipt Grid */}
      <div>
        <ReceiptGrid
          receipts={receipts}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onAddReceipt={handleAddReceipt}
        />
      </div>

      {/* Receipt Details Modal/Card */}
      {selectedReceipt && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto my-auto h-fit bg-background border shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Receipt Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Store Information</h3>
                <p><strong>Store:</strong> {selectedReceipt.storeName}</p>
                <p><strong>Amount:</strong> ${selectedReceipt.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(selectedReceipt.date).toLocaleDateString()}</p>
                <p><strong>Created:</strong> {new Date(selectedReceipt.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Receipt Image</h3>
                {selectedReceipt.imageUrl && (
                  <img
                    src={selectedReceipt.imageUrl}
                    alt={`Receipt from ${selectedReceipt.storeName}`}
                    className="w-full max-w-xs rounded-md border"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay for modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedReceipt(null)}
        />
      )}

      {/* Component Info */}
      <Card>
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">ReceiptCard Features:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Displays receipt image, store name, amount, and date</li>
              <li>Hover effects with view and delete buttons</li>
              <li>Click to view details functionality</li>
              <li>Delete functionality with API integration</li>
              <li>Responsive design</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">ReceiptGrid Features:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Responsive grid layout (1-4 columns based on screen size)</li>
              <li>Loading state with skeleton cards</li>
              <li>Empty state with call-to-action</li>
              <li>Grid header with receipt count</li>
              <li>Add receipt button integration</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">ReceiptSummary Features:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Total amount across all receipts</li>
              <li>Receipt count with proper pluralization</li>
              <li>Average amount per receipt</li>
              <li>Responsive card layout</li>
              <li>Icons and color coding for each metric</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
