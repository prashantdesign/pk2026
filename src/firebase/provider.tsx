'use client';

import { createContext, useContext } from 'react';
import type { FirebaseServices } from '.';

const FirebaseContext = createContext<FirebaseServices | null>(null);

export function FirebaseProvider(
  props: { children: React.ReactNode } & FirebaseServices
) {
  const { children, ...services } = props;
  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.app ?? null;
export const useFirestore = () => useContext(FirebaseContext)?.firestore ?? null;
export const useAuth = () => useContext(FirebaseContext)?.auth ?? null;
