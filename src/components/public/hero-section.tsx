'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
    const firestore = useFirestore();
    const siteContentRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'siteContent', 'global');
    }, [firestore]);
    const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);
    
    if (loading) {
        return (
            <section id="home" className="relative flex h-[80vh] min-h-[500px] w-full items-center justify-center text-center">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
                    <Skeleton className="h-16 w-3/4 mb-6" />
                    <Skeleton className="h-8 w-1/2 mb-10" />
                    <Skeleton className="h-12 w-40" />
                </div>
            </section>
        );
    }
    
    return (
        <section id="home" className="relative flex h-[80vh] min-h-[600px] w-full items-center justify-center overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    {siteContent?.heroTitle || "Creative Designer & Developer"}
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                    {siteContent?.heroSubtitle || "I design and code beautiful things, and I love what I do."}
                </p>
                <div className="mt-10 flex gap-4">
                    <Button asChild size="lg">
                        <Link href={siteContent?.ctaLink || "#work"}>
                            {siteContent?.ctaText || "View My Work"}
                            <ArrowDown className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
