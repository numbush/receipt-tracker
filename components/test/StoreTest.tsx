'use client';

import { useReceiptStore } from '../../store/receiptStore';
import { Receipt } from '../../types/receipt';

export default function StoreTest() {
  const {
    receipts,
    isLoading,
    error,
    addReceipt,
    deleteReceipt,
    setLoading,
    setError,
    getTotalAmount,
    getReceiptCount,
    getAverageAmount
  } = useReceiptStore();

  const testReceipt: Receipt = {
    _id: '1',
    imageUrl: 'https://example.com/receipt.jpg',
    storeName: 'Test Store',
    amount: 25.99,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const handleAddReceipt = () => {
    const newReceipt: Receipt = {
      ...testReceipt,
      _id: Date.now().toString(),
      storeName: `Store ${receipts.length + 1}`,
      amount: Math.round(Math.random() * 100 * 100) / 100
    };
    addReceipt(newReceipt);
  };

  const handleDeleteReceipt = (id: string) => {
    deleteReceipt(id);
  };

  const handleToggleLoading = () => {
    setLoading(!isLoading);
  };

  const handleToggleError = () => {
    setError(error ? null : 'Test error message');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Zustand Store Test</h2>
      
      {/* Store State Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Store State:</h3>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Receipt Count: {getReceiptCount()}</p>
        <p>Total Amount: ${getTotalAmount().toFixed(2)}</p>
        <p>Average Amount: ${getAverageAmount().toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 space-x-2">
        <button
          onClick={handleAddReceipt}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Test Receipt
        </button>
        <button
          onClick={handleToggleLoading}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Toggle Loading
        </button>
        <button
          onClick={handleToggleError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Toggle Error
        </button>
      </div>

      {/* Receipts List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Receipts:</h3>
        {receipts.length === 0 ? (
          <p className="text-gray-500">No receipts yet. Add some to test the store!</p>
        ) : (
          <div className="space-y-2">
            {receipts.map((receipt) => (
              <div key={receipt._id} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{receipt.storeName}</p>
                  <p className="text-sm text-gray-600">${receipt.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{receipt.date.toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteReceipt(receipt._id!)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
