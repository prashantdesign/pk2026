import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingLogoProps {
  className?: string;
  siteName?: string;
}

const LoadingLogo = ({ className, siteName = "PK.Design" }: LoadingLogoProps) => {
  // Calculate width based on character count approx.
  // Average char width for 50px bold font is roughly 30-35px.
  // We add some padding.
  const charCount = siteName.length;
  // Increase width estimate to ensure text fits
  const calculatedWidth = Math.max(160, charCount * 40);
  const viewBoxWidth = calculatedWidth;
  const centerY = 55;
  const centerX = viewBoxWidth / 2;

  const lastDotIndex = siteName.lastIndexOf('.');
  const hasDot = lastDotIndex !== -1;

  const mainText = hasDot ? siteName.substring(0, lastDotIndex) : siteName;
  const dotText = hasDot ? '.' + siteName.substring(lastDotIndex + 1) : '';

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={calculatedWidth} height="80" viewBox={`0 0 ${viewBoxWidth} 80`}>
        <style>
          {`
            .loading-text {
              font-family: var(--font-inter), sans-serif;
              font-size: 50px;
              font-weight: 700;
              letter-spacing: -0.02em;
            }
            .text-main {
              fill: transparent;
              stroke: hsl(var(--foreground));
              stroke-width: 2px;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
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
                stroke-dashoffset: 1000;
                fill: transparent;
              }
              30% {
                stroke-dashoffset: 0;
                fill: transparent;
              }
              50% {
                fill: hsl(var(--foreground));
              }
              70% {
                stroke-dashoffset: 0;
                fill: hsl(var(--foreground));
              }
              90%, 100% {
                stroke-dashoffset: -1000;
                fill: transparent;
                opacity: 0;
              }
            }

            @keyframes dot-pulse {
              0%, 30% {
                opacity: 0;
                transform: scale(0.5);
                transform-origin: center;
              }
              40% {
                opacity: 1;
                transform: scale(1.2);
              }
              50% {
                transform: scale(1);
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
        <text className="loading-text" x={centerX} y={centerY} textAnchor="middle">
            <tspan className="text-main">{mainText}</tspan>
            {hasDot && <tspan className="text-accent">{dotText}</tspan>}
        </text>
      </svg>
    </div>
  );
};

export default LoadingLogo;
