'use client';
import React, { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

export default function PortfolioSection({ onProjectClick }: PortfolioSectionProps) {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: projects, isLoading: loading } = useCollection<Project>(projectsQuery);

  return (
    <section id="work" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">My Work</h2>
        
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden cursor-pointer group"
              onClick={() => onProjectClick(project)}
            >
              <CardContent className="p-0 relative aspect-[4/3]">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    <p className="text-sm">{project.categoryId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
