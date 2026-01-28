'use client';
import React from 'react';
import { SiteContent } from '@/types';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  content?: Partial<SiteContent>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center pt-20">
        <div className="absolute inset-0 bg-background" />
        <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in-up">
                    {content?.heroTitle || 'Creative Designer & Developer'}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-300">
                    {content?.heroSubtitle || 'I design and code beautifully simple things, and I love what I do.'}
                </p>
                {content?.ctaText && content.ctaLink && (
                     <div className="animate-fade-in-up animation-delay-600">
                        <Button asChild size="lg">
                            <a href={content.ctaLink}>{content.ctaText}</a>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
};

export default HeroSection;
