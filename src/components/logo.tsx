import React from 'react';

interface LogoProps {
  className?: string;
  text?: string;
}

const Logo = ({ className, text = "PK.Design" }: LogoProps) => {
  // Split text by the last dot to color it differently, similar to the original design
  const lastDotIndex = text.lastIndexOf('.');
  const hasDot = lastDotIndex !== -1;

  const mainText = hasDot ? text.substring(0, lastDotIndex) : text;
  const suffixText = hasDot ? text.substring(lastDotIndex) : ''; // includes the dot

  // If there is a dot, we color the dot with primary color.
  // Actually, usually the dot IS the accent. Let's try to replicate "PK.Design" where "." is accent.

  return (
    <div className={`text-2xl font-bold tracking-tighter ${className}`}>
        {hasDot ? (
            <>
                <span className="text-foreground">{mainText}</span>
                <span className="text-primary">.</span>
                <span className="text-foreground">{suffixText.substring(1)}</span>
            </>
        ) : (
            <span className="text-foreground">{text}</span>
        )}
    </div>
  );
};

export default Logo;
