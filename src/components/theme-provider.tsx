"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderContext = createContext<{ theme: Theme, setTheme: (theme: Theme) => void } | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteContent", "theme"), (doc) => {
      if (doc.exists()) {
        const newTheme = doc.data().value as Theme;
        setTheme(newTheme);
      } else {
        // If no theme is set in Firestore, default to dark
        setTheme('dark');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching theme:", error);
      setLoading(false); // still stop loading on error, will use default theme
    });
    return () => unsub();
  }, []);

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
