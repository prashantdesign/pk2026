'use client';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import type { SiteContent } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const AboutSection = () => {
  const [content, setContent] = useState<SiteContent['about'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data() as SiteContent['about']);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const aboutImage = content?.aboutImageUrl || PlaceHolderImages.find(p => p.id === 'about-profile')?.imageUrl;

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
          About Me
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="md:col-span-1 flex justify-center">
            {loading ? (
                <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
            ) : (
                aboutImage && (
                    <Image
                        src={aboutImage}
                        alt="Portrait of the designer"
                        width={256}
                        height={256}
                        className="rounded-full object-cover w-48 h-48 md:w-64 md:h-64"
                        data-ai-hint="profile portrait"
                    />
                )
            )}
          </div>
          <div className="md:col-span-2">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {content?.bio}
              </p>
            )}
            <div className="mt-8 grid grid-cols-2 gap-8">
              {loading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                content?.stats && (
                  <>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{content.stats.projects}+</p>
                      <p className="text-sm text-muted-foreground">Projects Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{content.stats.experience}</p>
                      <p className="text-sm text-muted-foreground">Years of Experience</p>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">My Toolkit</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
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
};

export default AboutSection;
