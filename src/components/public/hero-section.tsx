'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { SiteContent } from '@/types';
import Link from 'next/link';

interface HeroSectionProps {
  content: SiteContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section id="home" className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-purple-500 to-accent opacity-80"></div>
        <div className="absolute inset-0 bg-background/60"></div>
        <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground animate-fade-in-down">
            {content?.heroTitle || "Creative Designer & Developer"}
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up">
            {content?.heroSubtitle || "I design and code beautiful simple things, and I love what I do."}
            </p>
            {content?.ctaText && content.ctaLink && (
            <Button asChild size="lg" className="animate-fade-in-up">
                <Link href={content.ctaLink}>{content.ctaText}</Link>
            </Button>
            )}
        </div>
    </section>
  );
}
