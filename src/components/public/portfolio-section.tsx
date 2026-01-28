'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type PortfolioSectionProps = {
  onProjectClick: (project: Project) => void;
};

const PortfolioSection = ({ onProjectClick }: PortfolioSectionProps) => {
  const firestore = useFirestore();

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: projects, loading } = useCollection<Project>(projectsQuery);

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    if (!projects) return ['All'];
    return ['All', ...Array.from(new Set(projects.map((p) => p.categoryId)))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects?.filter((p) => p.categoryId === activeCategory);
  }, [projects, activeCategory]);

  if (loading) {
    return (
      <section id="work" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">My Work</h2>
            <p className="mt-4 text-lg text-muted-foreground">A selection of my favorite projects.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="work" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">My Work</h2>
          <p className="mt-4 text-lg text-muted-foreground">A selection of my favorite projects.</p>
        </div>
        <div className="mt-10 flex justify-center gap-2 flex-wrap">
            {categories.map(category => (
                <Button 
                    key={category} 
                    variant={activeCategory === category ? 'default' : 'outline'}
                    onClick={() => setActiveCategory(category)}
                >
                    {category}
                </Button>
            ))}
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects?.map((project) => (
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
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-white/80">{project.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
