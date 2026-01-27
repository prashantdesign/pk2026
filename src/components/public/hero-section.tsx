"use client";

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { SiteContent } from '@/types';

const HeroSection = () => {
  const [content, setContent] = useState<SiteContent['hero'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteContent", "hero"), (doc) => {
      if (doc.exists()) {
        setContent(doc.data() as SiteContent['hero']);
      } else {
        // Set default content if nothing in DB
        setContent({
          title: "Creative Graphic & UI Designer",
          subtitle: "Crafting beautiful and intuitive digital experiences. Turning ideas into stunning visuals and seamless user interfaces.",
          ctaText: "View My Work",
          ctaLink: "#work",
          showCta: true,
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <section className="py-24 sm:py-32 md:py-40">
        <div className="container text-center">
          <Skeleton className="h-16 md:h-20 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 md:h-8 w-full max-w-2xl mx-auto mb-10" />
          <Skeleton className="h-12 w-40 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 sm:py-32 md:py-40">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          {content?.title}
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
          {content?.subtitle}
        </p>
        {content?.showCta && (
          <Button asChild size="lg">
            <a href={content.ctaLink}>{content.ctaText}</a>
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
