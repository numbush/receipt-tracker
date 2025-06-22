"use client";

import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  currency?: string;
  locale?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = '', onChange, currency = 'USD', locale = 'en-US', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Format number as currency
    const formatCurrency = (amount: string): string => {
      const numericValue = parseFloat(amount);
      if (isNaN(numericValue)) return '';
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    };

    // Remove currency formatting to get raw number
    const unformatCurrency = (formatted: string): string => {
      return formatted.replace(/[^0-9.-]/g, '');
    };

    // Update display value when prop value changes
    useEffect(() => {
      if (value !== undefined) {
        if (isFocused) {
          setDisplayValue(value);
        } else {
          setDisplayValue(value ? formatCurrency(value) : '');
        }
      }
    }, [value, isFocused, currency, locale]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      const rawValue = unformatCurrency(e.target.value);
      setDisplayValue(rawValue);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const rawValue = unformatCurrency(e.target.value);
      const formatted = rawValue ? formatCurrency(rawValue) : '';
      setDisplayValue(formatted);
      onChange?.(rawValue);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow only numbers, decimal point, and minus sign
      const sanitized = inputValue.replace(/[^0-9.-]/g, '');
      
      // Ensure only one decimal point
      const parts = sanitized.split('.');
      const formatted = parts.length > 2 
        ? parts[0] + '.' + parts.slice(1).join('')
        : sanitized;

      setDisplayValue(formatted);
      
      if (isFocused) {
        onChange?.(formatted);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, decimal point
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
      
      props.onKeyDown?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("text-right", className)}
        placeholder={isFocused ? "0.00" : formatCurrency("0")}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
