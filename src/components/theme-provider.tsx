"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import type { SiteContent } from '@/types';
import LoadingLogo from '@/components/loading-logo';
import { ThemeTransition } from '@/components/theme-transition';

type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderContext = createContext<{
  theme: Theme,
  setTheme: (theme: Theme) => void,
  toggleTheme: () => void
} | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextTheme, setNextTheme] = useState<Theme | null>(null);

  const firestore = useFirestore();
  
  const siteContentRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteContent', 'global');
  }, [firestore]);
  const { data: siteContent, loading } = useDoc<SiteContent & { theme?: Theme }>(siteContentRef);

  useEffect(() => {
    if (siteContent?.theme) {
      setTheme(siteContent.theme);
    }
  }, [siteContent]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return;
    const targetTheme = theme === 'light' ? 'dark' : 'light';
    setNextTheme(targetTheme);
    setIsTransitioning(true);
  }, [theme, isTransitioning]);

  const handleCovered = useCallback(() => {
    if (nextTheme) {
      setTheme(nextTheme);
    }
  }, [nextTheme]);

  const handleComplete = useCallback(() => {
    setIsTransitioning(false);
    setNextTheme(null);
  }, []);

  if (loading) {
    // This will prevent FOUC by showing a loader until the theme is fetched.
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <LoadingLogo />
        </div>
    );
  }

  return (
      <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme }}>
          {children}
          {isTransitioning && nextTheme && (
            <ThemeTransition
              targetTheme={nextTheme}
              onCovered={handleCovered}
              onComplete={handleComplete}
            />
          )}
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
