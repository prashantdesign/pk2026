'use client';
import React, { useMemo } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteContent } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

export default function AboutSection() {
  const firestore = useFirestore();
  const aboutRef = useMemo(() => firestore ? doc(firestore, 'siteContent/about') : null, [firestore]);
  const { data: content, loading } = useDoc<SiteContent['about']>(aboutRef as any);

  const stats = [
    { value: content?.stats?.projects, label: 'Projects Done' },
    { value: content?.stats?.experience, label: 'Years of Experience' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-8">
                    <Skeleton className="h-16 w-24" />
                    <Skeleton className="h-16 w-24" />
                </div>
                <Skeleton className="h-8 w-1/4" />
                <div className="flex flex-wrap gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-16" />)}
                </div>
            </div>
        </div>
      );
    }

    if (!content) {
      return <p>About content not found. Please add it in the admin panel.</p>;
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-2xl">
                    <CardContent className="p-0">
                    <Image
                        src={content.aboutImageUrl || 'https://picsum.photos/seed/about/600/800'}
                        alt="About Me"
                        width={600}
                        height={800}
                        className="object-cover w-full h-full"
                        data-ai-hint="professional portrait"
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-3 space-y-8">
                <Badge variant="secondary">About Me</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who I Am</h2>
                <p className="text-muted-foreground leading-relaxed">{content.bio}</p>
                <div className="flex flex-wrap gap-8">
                {stats.map((stat, i) => (
                  stat.value ? (
                    <div key={i}>
                        <p className="text-4xl font-bold text-primary">{stat.value.toString().padStart(2, '0')}+</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ) : null
                ))}
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">My Toolkit</h3>
                    <div className="flex flex-wrap gap-4">
                    {(content.tools || []).map((tool) => (
                        <div key={tool} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Icons name={tool} className="w-12 h-12" />
                        <span className="text-sm font-medium">{tool}</span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  return (
    <section id="about" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {renderContent()}
      </div>
    </section>
  );
}
