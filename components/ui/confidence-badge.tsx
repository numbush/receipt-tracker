interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low';
}

export const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    confidence === 'high' ? 'bg-green-100 text-green-800' :
    confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  }`}>
    {confidence === 'high' ? '✓' : confidence === 'medium' ? '⚠' : '!'} {confidence}
  </span>
);
