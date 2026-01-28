'use client';

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project, ProjectCategory } from '@/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

export default function PortfolioSection({ onProjectClick }: PortfolioSectionProps) {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'projectCategories'), orderBy('order')) : null
  , [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<ProjectCategory>(categoriesQuery);

  const allProjectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order'));
  }, [firestore]);

  const { data: allProjects, isLoading: projectsLoading } = useCollection<Project>(allProjectsQuery);
  
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    if (selectedCategory === 'all') return allProjects;
    return allProjects.filter(p => p.projectCategoryId === selectedCategory);
  }, [allProjects, selectedCategory]);

  const loading = categoriesLoading || projectsLoading;

  return (
    <section id="work" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">My Work</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">A selection of my projects.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12 animate-fade-in-up animation-delay-300">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects?.map((project, index) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer animate-fade-in-up aspect-[4/3]"
              style={{ animationDelay: `${300 + index * 100}ms` }}
              onClick={() => onProjectClick(project)}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-sm opacity-80">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      { !loading && filteredProjects?.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No projects found in this category.</p>
      )}
    </section>
  );
}
