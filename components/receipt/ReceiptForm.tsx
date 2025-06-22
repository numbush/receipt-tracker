"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ReceiptFormData, AIExtractionResult } from '@/types/receipt';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';

interface ReceiptFormProps {
  onSubmit: (data: ReceiptFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ReceiptFormData>;
  isLoading?: boolean;
  aiData?: AIExtractionResult;
}

interface FormErrors {
  storeName?: string;
  amount?: string;
  date?: string;
}

export function ReceiptForm({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isLoading = false,
  aiData
}: ReceiptFormProps) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    storeName: initialData.storeName || '',
    amount: initialData.amount || '',
    date: initialData.date || new Date().toISOString().split('T')[0], // Default to today
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill form with AI data when available
  useEffect(() => {
    if (aiData && aiData.success) {
      setFormData(prev => ({
        ...prev,
        storeName: aiData.storeName || prev.storeName,
        amount: aiData.amount ? aiData.amount.toString() : prev.amount,
      }));
    }
  }, [aiData]);

  // Validation rules
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Store name validation
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.trim().length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    }

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numericAmount = parseFloat(formData.amount);
      if (isNaN(numericAmount)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (numericAmount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else if (numericAmount > 999999.99) {
        newErrors.amount = 'Amount cannot exceed $999,999.99';
      }
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      } else if (selectedDate < oneYearAgo) {
        newErrors.date = 'Date cannot be more than a year ago';
      }
    }

    return newErrors;
  };

  // Handle field changes
  const handleFieldChange = (field: keyof ReceiptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle field blur (for validation feedback)
  const handleFieldBlur = (field: keyof ReceiptFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate just this field
    const fieldErrors = validateForm();
    setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      storeName: true,
      amount: true,
      date: true,
    });

    // Validate entire form
    const formErrors = validateForm();
    setErrors(formErrors);

    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Get error message for a field (only show if touched)
  const getFieldError = (field: keyof ReceiptFormData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Receipt Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Store Name Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="storeName">Store Name</Label>
              {aiData && aiData.success && aiData.storeName && (
                <ConfidenceBadge confidence={aiData.confidence} />
              )}
            </div>
            <Input
              id="storeName"
              type="text"
              value={formData.storeName}
              onChange={(e) => handleFieldChange('storeName', e.target.value)}
              onBlur={() => handleFieldBlur('storeName')}
              placeholder="Enter store name"
              className={getFieldError('storeName') ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {getFieldError('storeName') && (
              <p className="text-sm text-red-500">{getFieldError('storeName')}</p>
            )}
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              {aiData && aiData.success && aiData.amount && (
                <ConfidenceBadge confidence={aiData.confidence} />
              )}
            </div>
            <CurrencyInput
              id="amount"
              value={formData.amount}
              onChange={(value) => handleFieldChange('amount', value)}
              onBlur={() => handleFieldBlur('amount')}
              className={getFieldError('amount') ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {getFieldError('amount') && (
              <p className="text-sm text-red-500">{getFieldError('amount')}</p>
            )}
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              onBlur={() => handleFieldBlur('date')}
              className={getFieldError('date') ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {getFieldError('date') && (
              <p className="text-sm text-red-500">{getFieldError('date')}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Receipt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
