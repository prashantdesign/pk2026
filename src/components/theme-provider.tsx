"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';

type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderContext = createContext<{ theme: Theme, setTheme: (theme: Theme) => void } | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  const firestore = useFirestore();
  
  const themeRef = useMemo(() => firestore ? doc(firestore, 'siteContent', 'theme') : null, [firestore]);
  const { data: themeData, loading } = useDoc(themeRef);

  useEffect(() => {
    if (themeData) {
      const newTheme = (themeData as any).value as Theme;
      setTheme(newTheme);
    }
  }, [themeData]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  if (loading) {
    // This will prevent FOUC by showing a loader until the theme is fetched.
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        </div>
    );
  }

  return (
      <ThemeProviderContext.Provider value={{ theme, setTheme }}>
          {children}
      </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
