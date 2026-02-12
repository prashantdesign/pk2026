import React from 'react';
import { cn } from '@/lib/utils';

const LoadingLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width="150" height="70" viewBox="0 0 150 70">
        <style>
          {`
            .loading-text {
              font-family: var(--font-inter), sans-serif;
              font-size: 60px;
              font-weight: 700;
              letter-spacing: -0.05em;
            }
            .text-pk {
              fill: transparent;
              stroke: hsl(var(--foreground));
              stroke-width: 1.5;
              stroke-dasharray: 255;
              stroke-dashoffset: 255;
              animation: draw-letters 2.5s ease-in-out infinite;
            }
            .text-dot {
              fill: hsl(var(--primary));
              opacity: 0;
              animation: dot-pulse 2.5s ease-in-out infinite;
            }

            @keyframes draw-letters {
              0% {
                stroke-dashoffset: 255;
              }
              30% {
                stroke-dashoffset: 0;
              }
              70% {
                stroke-dashoffset: 0;
              }
              90%, 100% {
                stroke-dashoffset: -255;
                opacity: 0;
              }
            }

            @keyframes dot-pulse {
              0%, 30% {
                opacity: 0;
                transform: scale(0.8);
              }
              40% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                transform: scale(1.2);
              }
              70% {
                opacity: 1;
                transform: scale(1);
              }
              90%, 100% {
                opacity: 0;
              }
            }
          `}
        </style>
        <text className="loading-text text-pk" x="10" y="55">PK</text>
        <text className="loading-text text-dot" x="92" y="55">.</text>
      </svg>
    </div>
  );
};

export default LoadingLogo;
