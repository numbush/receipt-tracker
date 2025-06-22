'use client';

import { Receipt } from '@/types/receipt';
import { ReceiptCard } from './ReceiptCard';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt as ReceiptIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReceiptGridProps {
  receipts: Receipt[];
  isLoading?: boolean;
  onViewDetails?: (receipt: Receipt) => void;
  onAddReceipt?: () => void;
}

export function ReceiptGrid({ 
  receipts, 
  isLoading = false, 
  onViewDetails,
  onAddReceipt 
}: ReceiptGridProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="aspect-[4/3] bg-muted rounded"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ReceiptIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No receipts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start tracking your expenses by adding your first receipt. 
              You can take a photo or upload an existing image.
            </p>
            {onAddReceipt && (
              <Button onClick={onAddReceipt} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Receipt
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Your Receipts ({receipts.length})
        </h2>
        {onAddReceipt && (
          <Button onClick={onAddReceipt} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Receipt
          </Button>
        )}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt._id || `receipt-${receipt.storeName}-${receipt.date}`}
            receipt={receipt}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Grid Footer Info */}
      {receipts.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Showing {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
