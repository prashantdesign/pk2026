'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface ThemeTransitionProps {
  targetTheme: 'light' | 'dark';
  onCovered: () => void;
  onComplete: () => void;
}

export function ThemeTransition({ targetTheme, onCovered, onComplete }: ThemeTransitionProps) {
  const isCompleteRef = useRef(false);

  const handleAnimationComplete = () => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;

    // 1. Switch the global theme (onCovered)
    onCovered();
    // 2. Unmount the transition component (onComplete)
    // The overlay disappears, revealing the new theme underneath.
    onComplete();
  };

  // Failsafe: Ensure cleanup happens even if animation callback misses
  useEffect(() => {
    // Animation duration is 0.7s (700ms)
    // Set timeout to 800ms
    const timer = setTimeout(() => {
      handleAnimationComplete();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Use a simple circle clip path originating from top-right corner (approx toggle button location)
  // Initial: Circle size 0%
  // Animate: Circle size 150% (enough to cover the diagonal of the screen)
  const variants = {
    initial: { clipPath: `circle(0% at calc(100% - 3rem) 3rem)` },
    animate: { clipPath: `circle(150% at calc(100% - 3rem) 3rem)` },
  };

  // Hardcoded colors to match the theme variables without relying on CSS variables that change mid-animation
  // Dark: hsl(240 10% 3.9%) -> #09090b
  // Light: #ffffff
  const bgColor = targetTheme === 'dark' ? '#09090b' : '#ffffff';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ backgroundColor: bgColor }}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
