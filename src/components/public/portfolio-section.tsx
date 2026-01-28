'use client';
import React from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onProjectClick }) => {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects'), orderBy('order')) : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <section id="work" className="py-24 sm:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">My Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-background rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-60" />
                <div className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          {projects?.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative w-full h-60 overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <Badge variant="secondary" className="mb-2">{project.categoryId}</Badge>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 h-12 overflow-hidden">{project.description}</p>
                <Button variant="ghost" onClick={() => onProjectClick(project)}>
                  View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
