'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { 
  Bell, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

// Component that throws an error for testing error boundary
function ErrorComponent() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error('This is a test error for the Error Boundary!');
  }
  
  return (
    <div className="space-y-4">
      <p>This component will throw an error when you click the button below:</p>
      <Button 
        onClick={() => setShouldError(true)}
        variant="destructive"
        className="gap-2"
      >
        <AlertTriangle className="h-4 w-4" />
        Trigger Error
      </Button>
    </div>
  );
}

export default function TestAdvancedPage() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [testData, setTestData] = useState('');

  // Test different types of toast notifications
  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "This is a success notification with a checkmark.",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error occurred",
      description: "This is an error notification that stands out.",
      variant: "destructive",
    });
  };

  const showInfoToast = () => {
    toast({
      title: "Information",
      description: "This is an informational message for the user.",
    });
  };

  const showLongToast = () => {
    toast({
      title: "Detailed notification",
      description: "This is a longer notification message that demonstrates how the toast component handles more content. It should wrap nicely and remain readable.",
    });
  };

  // Test PWA features
  const testPWAInstall = () => {
    toast({
      title: "PWA Ready",
      description: "This app can be installed on your device! Look for the install prompt in your browser.",
    });
  };

  const testOfflineMode = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "Going offline" : "Back online",
      description: isOnline ? "Simulating offline mode" : "Connection restored",
      variant: isOnline ? "destructive" : "default",
    });
  };

  // Test service worker
  const testServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          toast({
            title: "Service Worker registered",
            description: "Offline support is now active!",
          });
        })
        .catch(() => {
          toast({
            title: "Service Worker failed",
            description: "Could not register service worker",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Not supported",
        description: "Service Workers are not supported in this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Advanced Features Test</h1>
        <p className="text-muted-foreground">
          Test all the advanced features implemented in Block 9
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Toast Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Toast Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={showSuccessToast} className="w-full gap-2">
              <CheckCircle className="h-4 w-4" />
              Success Toast
            </Button>
            <Button onClick={showErrorToast} variant="destructive" className="w-full gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error Toast
            </Button>
            <Button onClick={showInfoToast} variant="outline" className="w-full gap-2">
              <Info className="h-4 w-4" />
              Info Toast
            </Button>
            <Button onClick={showLongToast} variant="secondary" className="w-full">
              Long Message
            </Button>
          </CardContent>
        </Card>

        {/* Confirm Dialogs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirm Dialogs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast({
                      title: "Item deleted",
                      description: "The item has been successfully deleted.",
                    })}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Do you want to save your changes before leaving?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Don't Save</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast({
                      title: "Changes saved",
                      description: "Your changes have been saved successfully.",
                    })}
                  >
                    Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* PWA Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              PWA Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={testPWAInstall} className="w-full gap-2">
              <Smartphone className="h-4 w-4" />
              Test Install
            </Button>
            <Button onClick={testServiceWorker} variant="outline" className="w-full">
              Register SW
            </Button>
            <Button 
              onClick={testOfflineMode} 
              variant={isOnline ? "destructive" : "default"}
              className="w-full gap-2"
            >
              {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              {isOnline ? "Go Offline" : "Go Online"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Status: {isOnline ? "Online" : "Offline"}
            </div>
          </CardContent>
        </Card>

        {/* Error Boundary Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Boundary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <ErrorComponent />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Loading Skeletons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Skeletons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This shows how loading skeletons look in the receipt grid.
            </p>
          </CardContent>
        </Card>

        {/* Search & Filter Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search receipts..."
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minAmount">Min Amount</Label>
                <Input id="minAmount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="maxAmount">Max Amount</Label>
                <Input id="maxAmount" type="number" placeholder="999.99" />
              </div>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <Button 
              onClick={() => toast({
                title: "Filters applied",
                description: `Search: "${testData || 'none'}"`,
              })}
              className="w-full"
            >
              Apply Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Block 9: Advanced Features Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Implemented Features:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Search/filter receipts (in receipts page)</li>
                <li>• Sort by date/amount/store (in receipts page)</li>
                <li>• Loading skeletons (in receipt grid)</li>
                <li>• Error boundaries (global & component level)</li>
                <li>• Toast notifications (success, error, info)</li>
                <li>• Confirm dialogs for delete actions</li>
                <li>• PWA manifest for mobile installation</li>
                <li>• Service worker for offline support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 Key Benefits:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Enhanced user experience with feedback</li>
                <li>• Mobile-first PWA capabilities</li>
                <li>• Robust error handling</li>
                <li>• Smooth loading states</li>
                <li>• Intuitive search and filtering</li>
                <li>• Offline functionality</li>
                <li>• Professional UI polish</li>
                <li>• Accessible confirmation dialogs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
