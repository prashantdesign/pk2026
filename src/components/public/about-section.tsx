'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import Image from 'next/image';

interface AboutSectionProps {
  content?: SiteContent | null;
}

export default function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 animate-fade-in-up">
          {content?.aboutImageUrl && (
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                 <Image
                    src={content.aboutImageUrl}
                    alt="About Me"
                    fill
                    className="object-cover"
                />
            </div>
          )}
        </div>
        <div className="md:col-span-2 animate-fade-in-up animation-delay-300">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">About Me</h2>
          <div className="prose prose-lg prose-invert text-muted-foreground max-w-none">
            <p className="whitespace-pre-wrap">
              {content?.aboutText || "A passionate designer and developer."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
