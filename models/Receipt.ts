import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
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

const ReceiptSchema: Schema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imageBase64: {
      type: String,
      required: false,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    confidence: { 
      type: String, 
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    extractedText: { type: String },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'completed'
    }
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
ReceiptSchema.index({ date: -1 });
ReceiptSchema.index({ storeName: 1 });
ReceiptSchema.index({ amount: -1 });

export default mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);
