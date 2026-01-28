'use client';
import React from 'react';
import Image from 'next/image';
import type { SiteContent } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AboutSectionProps {
  content: SiteContent | null;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const aboutImage = content?.aboutImageUrl || PlaceHolderImages.find(p => p.id === 'about-profile')?.imageUrl;
  
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full max-w-sm mx-auto aspect-square">
            {aboutImage && (
              <Image
                src={aboutImage}
                alt="About me"
                fill
                className="rounded-lg object-cover shadow-lg"
              />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content?.aboutText || "I'm a passionate and creative designer with a knack for crafting beautiful and intuitive user experiences. With a background in graphic design and a love for technology, I bridge the gap between aesthetics and functionality."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
