'use client';

import { useEffect, useState } from 'react';

import { initializeFirebase, FirebaseProvider } from '.';
import type { FirebaseServices } from '.';
import { Skeleton } from '@/components/ui/skeleton';

export function FirebaseClientProvider(props: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const services = initializeFirebase();
    setFirebase(services);
  }, []);

  if (!firebase) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-1/4 space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
  }

  return <FirebaseProvider {...firebase}>{props.children}</FirebaseProvider>;
}
