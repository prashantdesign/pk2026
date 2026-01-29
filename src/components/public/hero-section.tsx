'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = ({ content }: { content: SiteContent | null }) => {
  return (
    <section id="home" className="relative h-[calc(100vh-5rem)] min-h-[500px]">
      <div className="container mx-auto flex h-full flex-col items-center justify-center text-center px-4 md:px-6">
        <div className="space-y-6 max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            {content?.heroTitle || 'Creative Designer & Developer'}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {content?.heroSubtitle ||
              'I design and build beautiful and functional user experiences.'}
          </p>
          {content?.ctaText && content.ctaLink && (
            <Button asChild size="lg" className="animate-fade-in-up animation-delay-300">
              <a href={content.ctaLink}>
                {content.ctaText}
                <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
