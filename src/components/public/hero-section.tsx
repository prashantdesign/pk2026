'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SiteContent } from '@/types';
import Link from 'next/link';

interface HeroSectionProps {
  content?: Partial<SiteContent>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  return (
    <section id="hero" className="relative flex h-[80vh] min-h-[600px] md:h-screen w-full items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-fuchsia-100 via-purple-100 to-blue-100 dark:from-fuchsia-950/30 dark:via-purple-950/20 dark:to-blue-950/40"></div>
      <div className="relative z-10 text-center px-4 container mx-auto">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-4 text-foreground animate-fade-in-up">
          {content?.heroTitle || 'Prashant Kumar'}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
          {content?.heroSubtitle || 'Graphic Designer'}
        </p>
        <div className="animate-fade-in-up animation-delay-600">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
            <Link href={content?.ctaLink || '#contact'}>
                {content?.ctaText || 'Contact'}
            </Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
