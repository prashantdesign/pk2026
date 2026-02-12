'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const angle = Math.atan2(mousePosition.y - eyeCenterY, mousePosition.x - eyeCenterX);
    const distance = Math.min(
      eyeRect.width / 4,
      Math.hypot(mousePosition.x - eyeCenterX, mousePosition.y - eyeCenterY) / 5
    );

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const pupilPos = calculatePupilPosition();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative flex items-center font-bold text-[10rem] md:text-[15rem] leading-none select-none">
        <span>4</span>
        <div
          ref={eyeRef}
          className="relative w-[0.8em] h-[0.8em] bg-white border-8 border-foreground rounded-full overflow-hidden mx-2 flex items-center justify-center"
        >
          <motion.div
            className="w-1/3 h-1/3 bg-black rounded-full"
            animate={{
              x: pupilPos.x,
              y: pupilPos.y
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          />
        </div>
        <span>4</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
        Oops! Page Not Found
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        It seems you've wandered into the unknown. The page you are looking for doesn't exist or has been moved.
      </p>

      <Button asChild size="lg">
        <Link href="/">
          Go Back Home
        </Link>
      </Button>
    </div>
  );
}
