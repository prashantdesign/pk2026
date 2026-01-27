import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteContent } from '@/types';

async function getHeroContent() {
    const docRef = doc(db, 'siteContent', 'hero');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as SiteContent['hero'];
    }
    return {
        title: 'Creative Designer & Developer',
        subtitle: 'I design and code beautifully simple things, and I love what I do.',
        ctaText: 'View My Work',
        ctaLink: '#work',
        showCta: true,
    }
}

export default async function HeroSection() {
    const content = await getHeroContent();
  return (
    <section id="hero" className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-grid-pattern bg-center [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
      <div className="container relative mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
          {content.subtitle}
        </p>
        {content.showCta && (
            <div className="mt-10">
            <Button asChild size="lg">
                <Link href={content.ctaLink}>
                    {content.ctaText}
                    <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
                </Link>
            </Button>
            </div>
        )}
      </div>
    </section>
  );
}
