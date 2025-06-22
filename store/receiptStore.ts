import { create } from 'zustand';
import { Receipt, AIExtractionResult } from '../types/receipt';

interface ReceiptStore {
  receipts: Receipt[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
  currentProcessingImage: string | null;
  
  // Actions
  setReceipts: (receipts: Receipt[]) => void;
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProcessing: (processing: boolean, image?: string) => void;
  processReceiptImage: (imageBase64: string) => Promise<AIExtractionResult>;
  
  // Computed values
  getTotalAmount: () => number;
  getReceiptCount: () => number;
  getAverageAmount: () => number;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: [],
  isLoading: false,
  error: null,
  isProcessing: false,
  currentProcessingImage: null,

  // Actions
  setReceipts: (receipts) => set({ receipts: Array.isArray(receipts) ? receipts : [] }),
  
  addReceipt: (receipt) => set((state) => ({
    receipts: [...state.receipts, receipt]
  })),
  
  updateReceipt: (id, updatedReceipt) => set((state) => ({
    receipts: state.receipts.map(receipt => 
      receipt._id === id ? { ...receipt, ...updatedReceipt } : receipt
    )
  })),
  
  deleteReceipt: (id) => set((state) => ({
    receipts: state.receipts.filter(receipt => receipt._id !== id)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  setProcessing: (processing, image) => set({ isProcessing: processing, currentProcessingImage: image || null }),

  processReceiptImage: async (imageBase64: string) => {
    set({ isProcessing: true, currentProcessingImage: imageBase64 });
    
    try {
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        return { ...result.data, success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return {
        storeName: '',
        amount: 0,
        confidence: 'low' as const,
        extractedText: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      set({ isProcessing: false, currentProcessingImage: null });
    }
  },

  // Computed values
  getTotalAmount: () => {
    const { receipts } = get();
    if (!Array.isArray(receipts)) return 0;
    return receipts.reduce((total, receipt) => total + receipt.amount, 0);
  },
  
  getReceiptCount: () => {
    const { receipts } = get();
    if (!Array.isArray(receipts)) return 0;
    return receipts.length;
  },
  
  getAverageAmount: () => {
    const { receipts } = get();
    if (!Array.isArray(receipts) || receipts.length === 0) return 0;
    const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    return total / receipts.length;
  }
}));
