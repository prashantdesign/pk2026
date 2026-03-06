'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import type { SiteContent } from '@/types';
import { ThemeTransition } from '@/components/animations/theme-transition';
import { LoadingLogo } from '@/components/animations/loading-logo';

type Theme = 'light' | 'dark';

interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextTheme, setNextTheme] = useState<Theme | null>(null);

  const firestore = useFirestore();
  const siteContentRef = useMemo(() => firestore ? doc(firestore, 'siteContent', 'global') : null, [firestore]);
  const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);

  useEffect(() => {
    // Check local storage first
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme | null : null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (siteContent?.theme) {
      setThemeState(siteContent.theme);
    }
  }, [siteContent]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setNextTheme(newTheme);
    setIsTransitioning(true);
  };

  const handleTransitionEnd = () => {
    // This is called when the curtain is fully down
    if (nextTheme) {
      setThemeState(nextTheme);
      // Wait a tiny bit for the new theme to apply before lifting the curtain
      setTimeout(() => {
        setNextTheme(null);
        setIsTransitioning(false);
      }, 100);
    } else {
      setIsTransitioning(false);
    }
  };

  // We only block rendering if we are waiting for initial firebase data
  // AND we don't have a local theme saved. This prevents flashing.
  const isInitialLoading = loading && typeof window !== 'undefined' && !localStorage.getItem('theme');

  if (isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-24 h-24 text-primary">
          <LoadingLogo />
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, toggleTheme }}>
      <ThemeTransition isChanging={isTransitioning} onTransitionEnd={handleTransitionEnd} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
