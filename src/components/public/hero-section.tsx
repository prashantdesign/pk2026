'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  content?: SiteContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center">
        <div className="container mx-auto px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up">
                {content?.heroTitle || "Creative Designer & Developer"}
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-300">
                {content?.heroSubtitle || "I design and build beautiful and functional user experiences."}
            </p>
            {content?.ctaText && content.ctaLink && (
                <a href={content.ctaLink}>
                    <Button size="lg" className="animate-fade-in-up animation-delay-600">
                        {content.ctaText}
                        <ArrowDown className="ml-2 h-5 w-5" />
                    </Button>
                </a>
            )}
        </div>
    </section>
  );
}
