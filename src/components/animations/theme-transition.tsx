"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeTransitionProps {
  isChanging: boolean;
  onTransitionEnd: () => void;
}

export const ThemeTransition = ({ isChanging, onTransitionEnd }: ThemeTransitionProps) => {
  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={(definition) => {
            // Only trigger if we just finished animating to "0%" (curtain down)
            // @ts-ignore: framer-motion types can be tricky with string definitions
            if (definition?.y === "0%" || (typeof definition === 'object' && definition.y === "0%")) {
               setTimeout(onTransitionEnd, 300);
            }
          }}
        >
          <div className="flex flex-col items-center gap-4">
             <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
             >
                <span className="text-4xl font-bold tracking-tight">PK</span>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
