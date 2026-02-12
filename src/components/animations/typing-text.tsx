'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TypingTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TypingText({ text, className, delay = 0 }: TypingTextProps) {
  const controls = useAnimation();

  // Split text into characters
  const characters = Array.from(text);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.h1
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index} style={{ marginRight: char === " " ? "0.25em" : "0" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
