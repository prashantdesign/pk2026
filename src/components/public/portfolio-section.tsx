"use client";

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project, Category } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

const PortfolioSection = ({ onProjectClick }: PortfolioSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qProjects = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
      if (categories.length > 0) setLoading(false);
    });

    const qCategories = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      if (categoriesData.length === 0) {
        setCategories([{ id: 'all', name: 'All', description: '', order: 0 }]);
      } else {
        setCategories([{ id: 'all', name: 'All', description: '', order: 0 }, ...categoriesData]);
      }
      if (projects.length > 0 || snapshot.docs.length > 0) setLoading(false);
    });
    
    // Handle case where collections are empty
    setTimeout(() => {
        if(loading) {
            setLoading(false)
            if(categories.length === 0) {
                setCategories([{ id: 'all', name: 'All', description: '', order: 0 }]);
            }
        }
    }, 3000);

    return () => {
      unsubProjects();
      unsubCategories();
    };
  }, []);

  const getProjectsByCategory = (categoryId: string) => {
    if (categoryId === 'all') return projects;
    return projects.filter(p => p.category === categoryId);
  };
  
  if (loading) {
    return (
      <section id="work" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of my projects.
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of my projects across various design disciplines.
          </p>
        </div>

        <Tabs defaultValue={categories[0]?.id || 'all'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:mx-auto sm:grid-flow-col">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {getProjectsByCategory(cat.id).map((project) => (
                  <Card 
                    key={project.id} 
                    className="overflow-hidden cursor-pointer group" 
                    onClick={() => onProjectClick(project)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                       <Image
                        src={project.mainImageUrl || "https://picsum.photos/seed/1/400/300"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="project image"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm">{project.shortDescription}</p>
                    </CardContent>
                  </Card>
                ))}
                {getProjectsByCategory(cat.id).length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center mt-8">No projects in this category yet.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default PortfolioSection;
