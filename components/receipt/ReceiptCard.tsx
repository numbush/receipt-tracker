'use client';

import { Receipt } from '@/types/receipt';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye } from 'lucide-react';
import { useReceiptStore } from '@/store/receiptStore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReceiptCardProps {
  receipt: Receipt;
  onViewDetails?: (receipt: Receipt) => void;
}

export function ReceiptCard({ receipt, onViewDetails }: ReceiptCardProps) {
  const { deleteReceipt } = useReceiptStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!receipt._id) return;
    
    setIsDeleting(true);
    try {
      // Call API to delete receipt
      const response = await fetch(`/api/receipts/${receipt._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from store
        deleteReceipt(receipt._id);
        
        // Show success toast
        toast({
          title: "Receipt deleted",
          description: `Receipt from ${receipt.storeName} has been deleted successfully.`,
        });
      } else {
        console.error('Failed to delete receipt');
        toast({
          title: "Error",
          description: "Failed to delete receipt. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(receipt);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1" onClick={handleViewDetails}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{receipt.storeName}</h3>
              {receipt.confidence && (
                <ConfidenceBadge confidence={receipt.confidence} />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(receipt.date)}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the receipt from {receipt.storeName}? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={handleViewDetails}>
        <div className="space-y-3">
          {/* Receipt Image */}
          {receipt.imageUrl && (
            <div className="aspect-[4/3] relative overflow-hidden rounded-md bg-muted">
              <img
                src={receipt.imageUrl}
                alt={`Receipt from ${receipt.storeName}`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="text-xl font-bold text-primary">
              {formatAmount(receipt.amount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
