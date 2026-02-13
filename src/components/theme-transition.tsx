'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { ThemeCharacter } from './animations/theme-character';

interface ThemeTransitionProps {
  targetTheme: 'light' | 'dark';
  onCovered: () => void;
  onComplete: () => void;
}

export function ThemeTransition({ targetTheme, onCovered, onComplete }: ThemeTransitionProps) {
  const handleAnimationComplete = () => {
    // When the wipe reaches the bottom (100% height):
    // 1. Switch the global theme (onCovered).
    onCovered();
    // 2. Unmount the transition component (onComplete).
    // Since the curtain is the same color as the new theme background,
    // removing it immediately should be seamless.
    onComplete();
  };

  const variants = {
    initial: { height: '0%' },
    animate: { height: '100%' },
  };

  // Hardcoded colors to match the theme variables without relying on CSS variables that change mid-animation
  // Dark: hsl(240 10% 3.9%) -> #09090b
  // Light: #ffffff
  const bgColor = targetTheme === 'dark' ? '#09090b' : '#ffffff';

  // Character color logic:
  // If targetTheme is 'dark' (curtain is black), character should be 'light' (white) to contrast.
  // If targetTheme is 'light' (curtain is white), character should be 'dark' (black) to contrast.
  const characterTheme = targetTheme === 'dark' ? 'light' : 'dark';

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none overflow-hidden"
      style={{ backgroundColor: bgColor }}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
    >
      {/*
        Character is positioned absolutely at the bottom center of the curtain.
        Since the container grows downwards, 'bottom: 0' keeps it at the leading edge.
      */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pb-0 translate-y-1/2">
         {/* translate-y-1/2 moves the character slightly down so it looks like it's pulling the edge */}
         <ThemeCharacter theme={characterTheme} />
      </div>
    </motion.div>
  );
}
