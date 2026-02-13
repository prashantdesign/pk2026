'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ThemeTransitionProps {
  targetTheme: 'light' | 'dark';
  onCovered: () => void;
  onComplete: () => void;
}

export function ThemeTransition({ targetTheme, onCovered, onComplete }: ThemeTransitionProps) {
  const [animationStep, setAnimationStep] = useState<'in' | 'out'>('in');

  const handleAnimationComplete = () => {
    if (animationStep === 'in') {
      onCovered();
      // Small delay to ensure theme switch has painted before sliding out?
      // Usually React updates are fast enough, but a small delay might feel smoother.
      // Let's try without delay first.
      setAnimationStep('out');
    } else {
      onComplete();
    }
  };

  const variants = {
    initial: { y: '-100%' },
    in: { y: '0%' },
    out: { y: '100%' },
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
      animate={animationStep}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}
