import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingLogoProps {
  className?: string;
  siteName?: string;
}

const LoadingLogo = ({ className, siteName = "PK.Design" }: LoadingLogoProps) => {
  // Calculate width based on character count approx.
  // Base 150 for "PK." (3 chars).
  // Let's approximate: 40px per char + some padding.
  const charCount = siteName.length;
  const calculatedWidth = Math.max(150, charCount * 35);
  const viewBoxWidth = calculatedWidth;
  const textX = 10;

  // Find if there is a dot to color separately, otherwise color the last char or just the whole text
  const lastDotIndex = siteName.lastIndexOf('.');
  const hasDot = lastDotIndex !== -1;

  const mainText = hasDot ? siteName.substring(0, lastDotIndex) : siteName;
  const dotText = hasDot ? '.' + siteName.substring(lastDotIndex + 1) : '';

  // If no dot, we just animate the whole text as "text-pk"
  // If dot, we separate them.

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={calculatedWidth} height="70" viewBox={`0 0 ${viewBoxWidth} 70`}>
        <style>
          {`
            .loading-text {
              font-family: var(--font-inter), sans-serif;
              font-size: 50px;
              font-weight: 700;
              letter-spacing: -0.05em;
            }
            .text-main {
              fill: transparent;
              stroke: hsl(var(--foreground));
              stroke-width: 1.5;
              stroke-dasharray: 400;
              stroke-dashoffset: 400;
              animation: draw-letters 3s ease-in-out infinite;
            }
            .text-accent {
              fill: hsl(var(--primary));
              opacity: 0;
              animation: dot-pulse 3s ease-in-out infinite;
              font-size: 50px;
            }

            @keyframes draw-letters {
              0% {
                stroke-dashoffset: 400;
              }
              30% {
                stroke-dashoffset: 0;
              }
              70% {
                stroke-dashoffset: 0;
              }
              90%, 100% {
                stroke-dashoffset: -400;
                opacity: 0;
              }
            }

            @keyframes dot-pulse {
              0%, 30% {
                opacity: 0;
                transform: scale(0.8);
                transform-origin: center;
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
        <text className="loading-text text-main" x={textX} y="55">{mainText}</text>
        {hasDot && <text className="loading-text text-accent" x={textX + (mainText.length * 28)} y="55">{dotText}</text>}
        {!hasDot && <text className="loading-text text-main" x={textX} y="55" style={{opacity: 0}}>{siteName}</text>}
      </svg>
    </div>
  );
};

export default LoadingLogo;
