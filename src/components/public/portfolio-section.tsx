'use client';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import ProjectCard from './project-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioSectionProps {
  onProjectClick: (project: Project) => void;
}

const PortfolioSection = ({ onProjectClick }: PortfolioSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
      
      const uniqueCategories = ['All', ...Array.from(new Set(projectsData.map(p => p.category)))];
      setCategories(uniqueCategories);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="work" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
          My Work
        </h2>
        
        {loading ? (
            <div className="flex justify-center mb-8">
                <Skeleton className="h-10 w-96" />
            </div>
        ) : (
            <Tabs defaultValue="All" className="w-full text-center mb-8">
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(category === 'All' ? projects : projects.filter(p => p.category === category)).map(project => (
                          <ProjectCard key={project.id} project={project} onProjectClick={onProjectClick} />
                        ))}
                    </div>
                  </TabsContent>
              ))}
            </Tabs>
        )}

        {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({length: 6}).map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
