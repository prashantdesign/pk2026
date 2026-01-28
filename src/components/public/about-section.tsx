'use client';

import React from 'react';
import type { SiteContent } from '@/types';
import Image from 'next/image';

interface AboutSectionProps {
  content?: Partial<SiteContent>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">About Me</h2>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground max-w-none">
              <p>
                {content?.aboutText ||
                  "I'm a passionate and creative designer with a knack for turning complex ideas into beautiful, intuitive, and functional designs. With a strong foundation in branding, UI/UX, and print design, I thrive on bringing visions to life. My approach is collaborative and user-centric, ensuring that every project not only looks great but also achieves its goals."}
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
             {content?.aboutImageUrl && (
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg">
                    <Image
                        src={content.aboutImageUrl}
                        alt="A portrait of the designer"
                        fill
                        className="object-cover"
                        data-ai-hint="profile portrait"
                    />
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
