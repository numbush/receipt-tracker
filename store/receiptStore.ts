import { create } from 'zustand';
import { Receipt } from '../types/receipt';

interface ReceiptStore {
  receipts: Receipt[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setReceipts: (receipts: Receipt[]) => void;
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getTotalAmount: () => number;
  getReceiptCount: () => number;
  getAverageAmount: () => number;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: [],
  isLoading: false,
  error: null,

  // Actions
  setReceipts: (receipts) => set({ receipts }),
  
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

  // Computed values
  getTotalAmount: () => {
    const { receipts } = get();
    return receipts.reduce((total, receipt) => total + receipt.amount, 0);
  },
  
  getReceiptCount: () => {
    const { receipts } = get();
    return receipts.length;
  },
  
  getAverageAmount: () => {
    const { receipts } = get();
    if (receipts.length === 0) return 0;
    const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    return total / receipts.length;
  }
}));
