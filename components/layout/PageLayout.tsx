'use client';

import React from 'react';
import { Navigation, MobileNavigation } from './Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showNavigation?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  className,
  showNavigation = true,
  maxWidth = 'full'
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Receipt Tracker</h1>
          </div>

          {/* Desktop Navigation */}
          {showNavigation && (
            <Navigation className="hidden sm:flex" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        'container mx-auto px-4 py-6',
        'pb-20 sm:pb-6', // Extra bottom padding on mobile for bottom nav
        className
      )}>
        <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>
          {/* Page Title */}
          {(title || subtitle) && (
            <div className="mb-6 text-center sm:text-left">
              {title && (
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      {showNavigation && <MobileNavigation />}
    </div>
  );
}

// Specialized layout for camera/capture pages
export function CameraPageLayout({ 
  children, 
  title = "Capture Receipt",
  subtitle = "Take a photo of your receipt to get started",
  ...props 
}: Omit<PageLayoutProps, 'maxWidth'>) {
  return (
    <PageLayout 
      title={title}
      subtitle={subtitle}
      maxWidth="2xl"
      {...props}
    >
      <div className="space-y-6">
        {children}
      </div>
    </PageLayout>
  );
}

// Specialized layout for list/grid pages
export function ListPageLayout({ 
  children, 
  title = "Your Receipts",
  subtitle,
  ...props 
}: PageLayoutProps) {
  return (
    <PageLayout 
      title={title}
      subtitle={subtitle}
      maxWidth="full"
      {...props}
    >
      <div className="space-y-6">
        {children}
      </div>
    </PageLayout>
  );
}

// Error boundary wrapper for pages
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PageErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const defaultFallback = (
    <PageLayout title="Something went wrong">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
          <p className="text-muted-foreground mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </CardContent>
      </Card>
    </PageLayout>
  );

  // Note: This is a simplified error boundary. In a real app, you'd use React's ErrorBoundary
  // For now, we'll just render the children and provide the structure
  return (
    <>
      {children}
    </>
  );
}
