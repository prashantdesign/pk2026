'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());

      // In a real app, you might want to log this to a service like Sentry
      // For this demo, we'll show a toast to the user
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `You don't have permission to perform this action.`,
      });
      
      // Throwing the error will make it visible in the Next.js dev overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}
