'use client';
import React from 'react';
import Image from 'next/image';
import { SiteContent } from '@/types';

interface AboutSectionProps {
  content?: Partial<SiteContent>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            {content?.aboutImageUrl ? (
              <Image
                src={content.aboutImageUrl}
                alt="About Me"
                width={500}
                height={500}
                className="rounded-lg object-cover aspect-square"
                data-ai-hint="profile portrait"
              />
            ) : (
                <div className="bg-muted rounded-lg aspect-square w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">Your photo here</span>
                </div>
            )}
          </div>
          <div className="space-y-6 animate-fade-in-up animation-delay-300">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h2>
              <p className="text-primary text-lg font-medium">Designer & Creative Thinker</p>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground text-base md:text-lg space-y-4">
              <p>{content?.aboutText || 'Your biography will appear here. You can edit this in the admin panel under Site Content.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
