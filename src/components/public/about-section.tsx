"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteContent } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '../icons';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutSection() {
  const [content, setContent] = useState<SiteContent['about'] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as SiteContent['about']);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Could not load about section content.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [toast]);
  
  const profileImage = PlaceHolderImages.find(img => img.id === 'about-profile');

  return (
    <section id="about" className="w-full py-20 md:py-32 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-2xl">
            {loading ? (
                <Skeleton className="h-full w-full" />
            ) : (
                <Image
                    src={content?.aboutImageUrl || profileImage?.imageUrl || "https://picsum.photos/seed/profile/400/400"}
                    alt="About Me"
                    fill
                    className="object-cover"
                    data-ai-hint="profile portrait"
                />
            )}
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">About Me</div>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">A Passionate Designer</h2>
                {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
                ) : (
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    {content?.bio}
                </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col items-start gap-1">
                {loading ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-bold">{content?.stats?.projects || 0}+</div>}
                <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
                </div>
                <div className="flex flex-col items-start gap-1">
                {loading ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-bold">{content?.stats?.experience || 0}+</div>}
                <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="mb-8 text-center text-2xl font-bold">My Toolkit</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-16" />)
            ) : (
              (content?.tools || []).map((tool) => (
                <div key={tool} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Icons name={tool} className="w-12 h-12" />
                  <span className="text-sm font-medium">{tool}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
