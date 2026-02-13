import React from 'react';
import { motion } from 'framer-motion';

export const ThemeCharacter = ({ theme }: { theme: 'light' | 'dark' }) => {
  // Simple cute robot/character SVG
  // When switching to dark, the character pulls down a dark curtain.
  // When switching to light, the character pulls down a light curtain.
  // The character color should contrast with the curtain being pulled.

  const characterColor = theme === 'dark' ? '#ffffff' : '#09090b';

  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pb-4"
      initial={{ scale: 0.8, rotate: -5 }}
      animate={{ scale: 1, rotate: 5 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.5
      }}
    >
      {/* Body */}
      <rect x="4" y="8" width="16" height="12" rx="2" fill={characterColor} />
      {/* Head */}
      <circle cx="12" cy="6" r="4" fill={characterColor} />
      {/* Eyes */}
      <circle cx="10" cy="6" r="1" fill={theme === 'dark' ? '#09090b' : '#ffffff'} />
      <circle cx="14" cy="6" r="1" fill={theme === 'dark' ? '#09090b' : '#ffffff'} />
      {/* Antenna */}
      <line x1="12" y1="2" x2="12" y2="6" stroke={characterColor} strokeWidth="2" />
      <circle cx="12" cy="1" r="1" fill={characterColor} />
      {/* Arms (holding up) */}
      <path d="M4 10L2 6" stroke={characterColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 10L22 6" stroke={characterColor} strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <path d="M8 20V24" stroke={characterColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 20V24" stroke={characterColor} strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
};
