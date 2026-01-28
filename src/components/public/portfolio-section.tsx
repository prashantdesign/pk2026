'use client';
import React from 'react';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSectionProps {
    onProjectClick: (project: Project) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onProjectClick }) => {
    const firestore = useFirestore();
    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
    }, [firestore]);
    const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <section id="work" className="py-20 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
            <p className="mt-4 text-muted-foreground">A selection of my projects.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
             <Skeleton key={i} className="h-80 w-full" />
          ))}
          {projects?.map((project, index) => (
            <Card 
              key={project.id}
              className="overflow-hidden cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => onProjectClick(project)}
            >
              <CardContent className="p-0">
                  <div className="relative aspect-video">
                      <Image 
                          src={project.imageUrl} 
                          alt={project.title} 
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="portfolio project"
                      />
                  </div>
                  <div className="p-4 bg-card">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!isLoading && projects?.length === 0 && (
            <p className="text-center mt-12 text-muted-foreground">No projects have been added yet. Add some from the admin panel!</p>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
