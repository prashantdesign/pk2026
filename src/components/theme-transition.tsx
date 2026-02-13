'use client';

import { motion } from 'framer-motion';
import React from 'react';

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
    // The underlying app is now the new theme.
    // The "Neon Line" at the bottom of the overlay will disappear instantly.
    // To make this smooth, we can have the overlay persist as the new background?
    // No, since the overlay IS the new background color, removing it just reveals the
    // identical app background underneath.
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

  // Neon Line Color (Primary Purple/Violet)
  // Based on --primary: 262.1 83.3% 57.8% -> Roughly #8b5cf6 (Tailwind violet-500)
  const neonColor = '#8b5cf6';

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none overflow-hidden flex flex-col justify-end"
      style={{ backgroundColor: bgColor }}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
    >
      {/*
        The Neon Line is positioned at the BOTTOM of the expanding container.
        Since the container grows downwards, 'bottom-0' keeps it at the leading edge.
      */}
      <div
        className="w-full h-1 relative"
        style={{
            backgroundColor: neonColor,
            boxShadow: `0 0 10px ${neonColor}, 0 0 20px ${neonColor}, 0 0 40px ${neonColor}`
        }}
      />
    </motion.div>
  );
}
