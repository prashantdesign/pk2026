'use client';

import React, { useMemo, useState } from 'react';
import type { SiteContent, Project, ProjectCategory } from '@/types';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { FadeIn } from '@/components/animations/fade-in';
import { HoverCard } from '@/components/animations/hover-card';
import { StaggerContainer, staggerItem } from '@/components/animations/stagger-container';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioSectionProps {
  content: SiteContent | null;
  onProjectClick: (project: Project) => void;
}

export default function PortfolioSection({ content, onProjectClick }: PortfolioSectionProps) {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const projectsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'projects'), orderBy('order', 'asc')) : null
  , [firestore]);

  const categoriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'projectCategories'), orderBy('order', 'asc')) : null
  , [firestore]);

  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<ProjectCategory>(categoriesQuery);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedCategory === 'all') return projects;
    return projects.filter(p => p.projectCategoryId === selectedCategory);
  }, [projects, selectedCategory]);

  const isLoading = projectsLoading || categoriesLoading;

  return (
    <section id="work" className="py-16 md:py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {content?.portfolioSectionTitle || 'My Work'}
            </h2>
          </FadeIn>
          {content?.portfolioSectionDescription && (
            <FadeIn delay={0.2}>
              <p className="mt-4 text-lg text-muted-foreground">
                {content.portfolioSectionDescription}
              </p>
            </FadeIn>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <>
            <FadeIn delay={0.4} direction="up">
              <div className="flex justify-center flex-wrap gap-2 mb-12">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
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
            </FadeIn>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={project.id}
                  >
                    <HoverCard className="h-full">
                      <Card
                        className="overflow-hidden group cursor-pointer h-full flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-300"
                        onClick={() => onProjectClick(project)}
                      >
                        <CardContent className="p-0 relative aspect-[4/3]">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                            data-ai-hint="project image"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-sm text-white/90 line-clamp-2">{project.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

             {filteredProjects.length === 0 && (
                <FadeIn>
                    <div className="text-center col-span-full py-12 text-muted-foreground">
                        No projects found in this category.
                    </div>
                </FadeIn>
             )}
          </>
        )}
      </div>
    </section>
  );
}
