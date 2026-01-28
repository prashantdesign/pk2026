'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteContent } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const AboutSection = () => {
  const firestore = useFirestore();

  const siteContentRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteContent', 'global');
  }, [firestore]);

  const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);

  const aboutImage =
    siteContent?.aboutImageUrl ||
    PlaceHolderImages.find((p) => p.id === 'about-profile')?.imageUrl;
  
  const aboutImageHint =
    PlaceHolderImages.find((p) => p.id === 'about-profile')?.imageHint;


  if (loading) {
    return (
      <section id="about" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-1">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-48 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 sm:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-2">
            <div className="aspect-[4/5] relative rounded-lg shadow-2xl overflow-hidden">
                {aboutImage && (
                    <Image
                        src={aboutImage}
                        alt="Portrait of the designer"
                        fill
                        className="object-cover"
                        data-ai-hint={aboutImageHint}
                    />
                )}
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About Me
            </h2>
            <p className="mt-6 text-lg text-muted-foreground whitespace-pre-wrap">
              {siteContent?.aboutText ||
                `I'm a passionate designer with a knack for creating beautiful and intuitive user experiences. With a background in graphic design and a love for technology, I bridge the gap between aesthetics and functionality.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
