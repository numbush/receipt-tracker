'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReceiptStore } from '@/store/receiptStore';
import { DollarSign, Receipt, TrendingUp } from 'lucide-react';

interface ReceiptSummaryProps {
  className?: string;
}

export function ReceiptSummary({ className }: ReceiptSummaryProps) {
  const { getTotalAmount, getReceiptCount, getAverageAmount } = useReceiptStore();

  const totalAmount = getTotalAmount();
  const receiptCount = getReceiptCount();
  const averageAmount = getAverageAmount();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Amount',
      value: formatCurrency(totalAmount),
      description: 'Total spent across all receipts',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Receipt Count',
      value: receiptCount.toString(),
      description: `Receipt${receiptCount !== 1 ? 's' : ''} tracked`,
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Amount',
      value: formatCurrency(averageAmount),
      description: 'Average per receipt',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {summaryCards.map((card) => {
        const IconComponent = card.icon;
        
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${card.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
