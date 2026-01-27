'use client';
import React, { useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown } from 'lucide-react';
import type { SiteContent } from '@/types';

export default function HeroSection() {
  const firestore = useFirestore();
  const heroRef = useMemo(() => firestore ? doc(firestore, 'siteContent/hero') : null, [firestore]);
  const { data: heroData, loading } = useDoc<SiteContent['hero']>(heroRef as any);

  if (loading) {
    return (
      <section className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-36" />
      </section>
    );
  }
  
  if (!heroData) {
    return (
        <section className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Hero Title Not Found
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Please set the hero content in the admin panel.
            </p>
        </section>
    )
  }

  return (
    <section id="home" className="relative flex h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm"></div>

        <div className="container relative z-10 mx-auto flex flex-col items-center justify-center gap-6 px-4 text-center md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                {heroData.title}
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
                {heroData.subtitle}
            </p>
            {heroData.showCta && heroData.ctaLink && heroData.ctaText && (
            <Button asChild size="lg" className="mt-4">
                <a href={heroData.ctaLink}>
                    {heroData.ctaText}
                    <ArrowDown className="ml-2 h-5 w-5" />
                </a>
            </Button>
            )}
        </div>
    </section>
  );
}
