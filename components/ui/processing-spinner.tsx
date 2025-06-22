export const ProcessingSpinner = () => (
  <div className="flex items-center space-x-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    <span className="text-sm text-gray-600">AI analyzing receipt...</span>
  </div>
);
