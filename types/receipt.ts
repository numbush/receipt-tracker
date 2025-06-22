export interface Receipt {
  _id?: string;
  imageUrl: string;
  imageBase64?: string;
  storeName: string;
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptFormData {
  storeName: string;
  amount: string;
  date: string;
}
