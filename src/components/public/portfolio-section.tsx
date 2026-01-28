"use client";

import React, { useMemo, useState } from 'react';
import type { Project } from '@/types';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { Icons } from '../icons';

const ProjectCard = ({ project, onProjectClick }: { project: Project, onProjectClick: (project: Project) => void }) => {
  return (
    <Card 
      className="overflow-hidden group cursor-pointer animate-fade-in-up"
      onClick={() => onProjectClick(project)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="project image"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.toolsUsed?.split(',').map((tool) => {
              const toolName = tool.trim().toLowerCase();
              return (
                <div key={toolName} className="flex items-center gap-2 bg-secondary text-secondary-foreground/80 px-2 py-1 rounded-md">
                   <Icons name={toolName} className="h-4 w-4" />
                   <span className="text-xs font-medium">{tool.trim()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsList = ({ onProjectClick }: { onProjectClick: (project: Project) => void }) => {
  const firestore = useFirestore();
  const [visibleProjects, setVisibleProjects] = useState(6);

  const projectsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'projects'), orderBy('order', 'asc')) : null,
    [firestore]
  );
  
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects?.slice(0, visibleProjects).map((project, index) => (
          <div key={project.id} style={{ animationDelay: `${index * 150}ms`}}>
            <ProjectCard project={project} onProjectClick={onProjectClick} />
          </div>
        ))}
      </div>
      {projects && visibleProjects < projects.length && (
        <div className="text-center mt-16">
          <Button onClick={() => setVisibleProjects(projects.length)} size="lg">
            Show All Projects
          </Button>
        </div>
      )}
    </div>
  );
};

const PortfolioSection = ({ onProjectClick }: { onProjectClick: (project: Project) => void }) => {
  return (
    <section id="work" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold tracking-tight">My Work</h2>
          <p className="text-muted-foreground mt-2">A collection of my favorite projects.</p>
        </div>
        <ProjectsList onProjectClick={onProjectClick} />
      </div>
    </section>
  );
};

export default PortfolioSection;

    