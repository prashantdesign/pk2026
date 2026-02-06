'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      // Extract numeric part if any (e.g., "50+" -> 50)
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      if (!isNaN(numericValue)) {
        motionValue.set(numericValue);
      }
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        // If the original value had a suffix like "+", append it back
        const suffix = value.replace(/[0-9]/g, '');
        ref.current.textContent = Math.round(latest).toString() + suffix;
      }
    });
  }, [springValue, value]);

  return <span ref={ref} className={className} />;
}
