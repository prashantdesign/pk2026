'use client';

import { useEffect } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

interface ThemeSettings {
  primaryColor?: string; // HSL values like "262.1 83.3% 57.8%"
  fontFamily?: string; // Font family name
  radius?: string; // border-radius
}

export function ThemeCustomizer() {
  const firestore = useFirestore();
  // We fetch 'siteContent/global' which contains { themeSettings: ... }
  // Since useDoc hook handles loading state internally, we just use the data
  const { data: siteContent } = useDoc<any>(firestore ? doc(firestore, 'siteContent', 'global') : null);

  useEffect(() => {
    if (siteContent?.themeSettings) {
      const settings = siteContent.themeSettings as ThemeSettings;
      const root = document.documentElement;

      if (settings.primaryColor) {
        // Assume format is just HSL values (e.g., "262.1 83.3% 57.8%")
        // Or Hex? Tailwind uses HSL variables.
        // Let's assume we store the HSL string directly.
        root.style.setProperty('--primary', settings.primaryColor);
        root.style.setProperty('--ring', settings.primaryColor);
        root.style.setProperty('--sidebar-primary', settings.primaryColor);
        root.style.setProperty('--sidebar-ring', settings.primaryColor);
      }

      if (settings.radius) {
        root.style.setProperty('--radius', settings.radius);
      }

      if (settings.fontFamily) {
        if (settings.fontFamily === 'Inter') {
           root.style.setProperty('--font-heading', 'var(--font-inter)');
           root.style.setProperty('--font-body', 'var(--font-inter)');
        } else if (settings.fontFamily === 'Serif') {
           root.style.setProperty('--font-heading', 'serif');
           root.style.setProperty('--font-body', 'serif');
        } else if (settings.fontFamily === 'Mono') {
           root.style.setProperty('--font-heading', 'monospace');
           root.style.setProperty('--font-body', 'monospace');
        } else {
           root.style.setProperty('--font-heading', settings.fontFamily);
           root.style.setProperty('--font-body', settings.fontFamily);
        }
      }
    }
  }, [siteContent]);

  return null;
}
