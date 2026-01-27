'use client';

import React from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

export default function PortfolioSection({ onProjectClick }: PortfolioSectionProps) {
  const firestore = useFirestore();
  const projectsQuery = firestore ? query(collection(firestore, 'projects'), orderBy('order', 'asc')) : null;
  const { data: projects, loading } = useCollection<Project>(projectsQuery);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      );
    }
    
    if (!projects || projects.length === 0) {
        return <p>No projects found. Please add some in the admin panel.</p>
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(projects as Project[]).map((project) => (
          <Card 
            key={project.id} 
            className="group overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/50 transition-all duration-300"
            onClick={() => onProjectClick(project)}
          >
            <CardContent className="p-0 relative">
              <Image
                src={project.mainImageUrl || 'https://picsum.photos/seed/project/600/400'}
                alt={project.title}
                width={600}
                height={400}
                className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-sm opacity-80 mt-1">{project.shortDescription}</p>
                <div className="flex items-center text-sm mt-4 font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <section id="work" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge>My Work</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Selected Projects</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Here are a few projects I've worked on recently.
            </p>
        </div>
        {renderContent()}
      </div>
    </section>
  );
}
