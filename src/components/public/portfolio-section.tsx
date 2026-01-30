"use client";

import React, { useMemo, useState } from 'react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { Project, ProjectCategory, SiteContent } from '@/types';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from './section-header';
import { Skeleton } from '../ui/skeleton';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
  content?: SiteContent | null;
}

export default function PortfolioSection({ onProjectClick, content }: PortfolioSectionProps) {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projectCategories'), orderBy('order', 'asc'));
  }, [firestore]);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    if (selectedCategory) {
      return query(
        collection(firestore, 'projects'),
        where('projectCategoryId', '==', selectedCategory),
        orderBy('order', 'asc')
      );
    }
    return query(collection(firestore, 'projects'), orderBy('order', 'asc'));
  }, [firestore, selectedCategory]);

  const { data: categories, loading: categoriesLoading } = useCollection<ProjectCategory>(categoriesQuery);
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsQuery);

  const loading = categoriesLoading || projectsLoading;

  return (
    <section id="work" className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title={content?.portfolioSectionTitle}
          description={content?.portfolioSectionDescription}
        />
        
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up animation-delay-300">
          <Button
            variant={!selectedCategory ? 'default' : 'secondary'}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects?.map((project, index) => (
              <Card
                key={project.id}
                className="group overflow-hidden cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => onProjectClick(project)}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

    