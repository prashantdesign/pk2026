'use client';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { SiteContent } from '@/types';

const HeroSection = () => {
  const [content, setContent] = useState<SiteContent['hero'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'hero');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as SiteContent['hero']);
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
      <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 md:px-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <Skeleton className="h-12 w-40" />
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4 md:px-6">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        {content.title}
      </h1>
      <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
        {content.subtitle}
      </p>
      {content.showCta && content.ctaText && content.ctaLink && (
        <Button size="lg" asChild className="mt-8">
          <a href={content.ctaLink}>
            {content.ctaText}
            <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
          </a>
        </Button>
      )}
    </section>
  );
};

export default HeroSection;
