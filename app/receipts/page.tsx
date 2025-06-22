'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ListPageLayout } from '@/components/layout/PageLayout';
import { ReceiptGrid } from '@/components/receipt/ReceiptGrid';
import { ReceiptSummary } from '@/components/receipt/ReceiptSummary';
import { useReceiptStore } from '@/store/receiptStore';
import { Receipt } from '@/types/receipt';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar,
  DollarSign,
  Store,
  Plus,
  RefreshCw
} from 'lucide-react';

type SortField = 'date' | 'amount' | 'storeName';
type SortOrder = 'asc' | 'desc';

interface ReceiptFilters {
  search: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
  storeName: string;
}

export default function ReceiptsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    receipts, 
    isLoading, 
    error, 
    setReceipts, 
    setLoading, 
    setError 
  } = useReceiptStore();

  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReceiptFilters>({
    search: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    storeName: ''
  });

  // Load receipts from API
  const loadReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/receipts');
      if (!response.ok) {
        throw new Error('Failed to load receipts');
      }

      const data = await response.json();
      
      // Handle API response format - extract receipts array from data property
      const receiptsArray = data.success ? data.data : data;
      
      // Ensure we have an array
      if (!Array.isArray(receiptsArray)) {
        throw new Error('Invalid response format: expected array of receipts');
      }
      
      // Convert date strings back to Date objects
      const receiptsWithDates = receiptsArray.map((receipt: any) => ({
        ...receipt,
        date: new Date(receipt.date),
        createdAt: new Date(receipt.createdAt),
        updatedAt: new Date(receipt.updatedAt)
      }));

      setReceipts(receiptsWithDates);
      
      // Show success toast on refresh (not initial load)
      if (receipts.length > 0) {
        toast({
          title: "Receipts refreshed",
          description: `Loaded ${receiptsWithDates.length} receipt${receiptsWithDates.length !== 1 ? 's' : ''}`,
        });
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load receipts';
      setError(errorMessage);
      
      toast({
        title: "Error loading receipts",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setReceipts, setLoading, setError]);

  // Load receipts on component mount
  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...receipts];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(receipt =>
        receipt.storeName.toLowerCase().includes(searchLower)
      );
    }

    // Apply amount filters
    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      if (!isNaN(minAmount)) {
        filtered = filtered.filter(receipt => receipt.amount >= minAmount);
      }
    }

    if (filters.maxAmount) {
      const maxAmount = parseFloat(filters.maxAmount);
      if (!isNaN(maxAmount)) {
        filtered = filtered.filter(receipt => receipt.amount <= maxAmount);
      }
    }

    // Apply date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(receipt => receipt.date >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(receipt => receipt.date <= endDate);
    }

    // Apply store name filter
    if (filters.storeName) {
      const storeNameLower = filters.storeName.toLowerCase();
      filtered = filtered.filter(receipt =>
        receipt.storeName.toLowerCase().includes(storeNameLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'date':
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'storeName':
          aValue = a.storeName.toLowerCase();
          bValue = b.storeName.toLowerCase();
          break;
        default:
          aValue = a.date.getTime();
          bValue = b.date.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredReceipts(filtered);
  }, [receipts, filters, sortField, sortOrder]);

  // Handle filter changes
  const handleFilterChange = useCallback((field: keyof ReceiptFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      storeName: ''
    });
  }, []);

  // Handle navigation
  const handleAddReceipt = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleViewDetails = useCallback((receipt: Receipt) => {
    // For now, just log the receipt details
    // In a full implementation, this would navigate to a detail page
    console.log('View receipt details:', receipt);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadReceipts();
  }, [loadReceipts]);

  if (error) {
    return (
      <ListPageLayout title="Error Loading Receipts">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Receipts</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleAddReceipt} variant="outline">
                Add Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </ListPageLayout>
    );
  }

  return (
    <ListPageLayout 
      title="Your Receipts"
      subtitle={`${filteredReceipts.length} receipt${filteredReceipts.length !== 1 ? 's' : ''} found`}
    >
      <div className="space-y-6">
        {/* Summary Section */}
        {receipts.length > 0 && (
          <ReceiptSummary />
        )}

        {/* Controls Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button
                  onClick={handleAddReceipt}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Receipt
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      placeholder="0.00"
                      value={filters.minAmount}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxAmount">Max Amount</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      placeholder="999.99"
                      value={filters.maxAmount}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">From Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">To Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSortChange('date')}
                      className="gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Date
                      {sortField === 'date' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSortChange('amount')}
                      className="gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Amount
                      {sortField === 'amount' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSortChange('storeName')}
                      className="gap-2"
                    >
                      <Store className="h-4 w-4" />
                      Store
                      {sortField === 'storeName' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipts Grid */}
        <ReceiptGrid
          receipts={filteredReceipts}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onAddReceipt={handleAddReceipt}
        />
      </div>
    </ListPageLayout>
  );
}
