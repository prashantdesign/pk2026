'use client';
import React, { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '@/types';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

export default function PortfolioSection({ onProjectClick }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const firestore = useFirestore();

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projectCategories'), orderBy('order'));
  }, [firestore]);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    if (selectedCategory) {
      return query(collection(firestore, 'projects'), where('projectCategoryId', '==', selectedCategory), orderBy('order'));
    }
    return query(collection(firestore, 'projects'), orderBy('order'));
  }, [firestore, selectedCategory]);

  const { data: categories, loading: categoriesLoading } = useCollection<ProjectCategory>(categoriesQuery);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsQuery);

  const loading = categoriesLoading || projectsLoading;

  return (
    <section id="work" className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Selected Work</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Here are some of the projects I'm most proud of.
        </p>

        {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
        ) : (
            <>
                <div className="flex justify-center flex-wrap gap-2 mb-12">
                    <Button
                        variant={!selectedCategory ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(null)}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    {categories?.map((cat) => (
                        <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="rounded-full"
                        >
                        {cat.name}
                        </Button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                {projects?.map((project, index) => (
                    <div
                    key={project.id}
                    className="group cursor-pointer animate-fade-in-up"
                    onClick={() => onProjectClick(project)}
                    style={{ animationDelay: `${index * 100}ms`}}
                    >
                    <div className="overflow-hidden rounded-lg mb-4">
                        <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    </div>
                ))}
                </div>
                 {projects?.length === 0 && (
                    <p className="text-center text-muted-foreground">No projects found for this category.</p>
                )}
            </>
        )}
      </div>
    </section>
  );
}
