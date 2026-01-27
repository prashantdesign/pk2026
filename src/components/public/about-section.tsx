"use client";

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import type { SiteContent } from '@/types';

const AboutSection = () => {
  const [content, setContent] = useState<SiteContent['about'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteContent", "about"), (doc) => {
      if (doc.exists()) {
        setContent(doc.data() as SiteContent['about']);
      } else {
        setContent({
          bio: "I'm a passionate graphic and UI/UX designer with a love for creating clean, engaging, and user-centric designs. With a background in fine arts and digital media, I bring a unique blend of creativity and technical skill to every project. My goal is to translate complex ideas into simple, beautiful, and intuitive solutions.",
          stats: { projects: 50, experience: 5, clients: 30 },
          tools: ["Figma", "Photoshop", "Illustrator", "After Effects", "Spline"],
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            {loading ? (
                <>
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                </>
            ) : (
                <p className="text-lg text-muted-foreground">{content?.bio}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">
                  {loading ? <Skeleton className="h-10 w-16"/> : `${content?.stats.projects}+`}
                </CardTitle>
                <p className="text-muted-foreground">Projects Completed</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">
                  {loading ? <Skeleton className="h-10 w-12"/> : `${content?.stats.experience}+`}
                </CardTitle>
                <p className="text-muted-foreground">Years of Experience</p>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-10">My Toolkit</h3>
          <div className="flex justify-center items-center flex-wrap gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-16" />)
            ) : (
              content?.tools.map((tool) => (
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
