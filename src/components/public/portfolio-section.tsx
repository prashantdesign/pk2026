'use client';
import React, { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '@/types';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

const PortfolioSection = ({ onProjectClick }: PortfolioSectionProps) => {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('order'));
  }, [firestore]);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projectCategories'), orderBy('order'));
  }, [firestore]);

  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<ProjectCategory>(categoriesQuery);

  const categoryMap = useMemo(() => {
    return categories?.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {} as Record<string, string>) || {};
  }, [categories]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedCategory === 'all') return projects;
    return projects.filter(project => project.projectCategoryId === selectedCategory);
  }, [projects, selectedCategory]);

  const loading = projectsLoading || categoriesLoading;

  return (
    <section id="work" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Work</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-center">A selection of my projects. Click to see the details.</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-8 animate-fade-in-up animation-delay-300">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories?.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && [...Array(6)].map((_, i) => (
             <Card key={i}><CardContent className="p-0"><Skeleton className="w-full h-80" /></CardContent></Card>
          ))}
          {!loading && filteredProjects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${(index % 3) * 150}ms` }}
              onClick={() => onProjectClick(project)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-sm text-primary">{categoryMap[project.projectCategoryId] || 'Uncategorized'}</p>
                  <p className="text-muted-foreground mt-2 text-sm">{project.description}</p>
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
