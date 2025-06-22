'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Receipt, Home, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Capture',
      icon: Camera,
      description: 'Take photo of receipt'
    },
    {
      href: '/receipts',
      label: 'Receipts',
      icon: Receipt,
      description: 'View all receipts'
    },
    {
      href: '/test-upload',
      label: 'Test Upload',
      icon: Upload,
      description: 'Test image upload'
    },
    {
      href: '/test-advanced',
      label: 'Advanced',
      icon: Zap,
      description: 'Test advanced features'
    }
  ];

  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'flex items-center space-x-2 transition-colors',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

// Mobile bottom navigation for better mobile UX
export function MobileNavigation({ className }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Capture',
      icon: Camera,
    },
    {
      href: '/receipts',
      label: 'Receipts',
      icon: Receipt,
    }
  ];

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 bg-background border-t border-border',
      'flex items-center justify-around py-2 px-4 z-50',
      'sm:hidden', // Only show on mobile
      className
    )}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'flex flex-col items-center space-y-1 h-auto py-2 w-full',
                isActive && 'text-primary'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive && 'text-primary'
              )} />
              <span className={cn(
                'text-xs',
                isActive && 'text-primary font-medium'
              )}>
                {item.label}
              </span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
