export interface Receipt {
  _id?: string;
  imageUrl: string;
  imageBase64?: string;
  storeName: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  confidence?: 'high' | 'medium' | 'low';
  extractedText?: string;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ReceiptFormData {
  storeName: string;
  amount: string;
  date: string;
}

export interface AIExtractionResult {
  storeName: string;
  amount: number;
  confidence: 'high' | 'medium' | 'low';
  extractedText: string;
  success: boolean;
  error?: string;
}
