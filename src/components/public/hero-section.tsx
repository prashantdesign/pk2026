'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  showCta: boolean;
}

export default function HeroSection() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'siteContent', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as HeroContent);
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section id="home" className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-secondary/30">
        <div className="container px-4 md:px-6 text-center">
          <div className="flex flex-col items-center space-y-6">
            <Skeleton className="h-14 w-3/4 md:h-16" />
            <Skeleton className="h-6 w-full max-w-2xl" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    );
  }
  
  const heroContent = content || {
      title: "Showcasing Creative Excellence",
      subtitle: "A digital portfolio for a creative Graphic, UI, and Brand Designer.",
      ctaText: "View My Work",
      ctaLink: "#work",
      showCta: true,
  };

  return (
    <section id="home" className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-secondary/30">
      <div className="container px-4 md:px-6 text-center">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
            {heroContent.title}
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            {heroContent.subtitle}
          </p>
          {heroContent.showCta && heroContent.ctaText && heroContent.ctaLink && (
            <Link href={heroContent.ctaLink} passHref>
              <Button size="lg" className="mt-4">
                {heroContent.ctaText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
