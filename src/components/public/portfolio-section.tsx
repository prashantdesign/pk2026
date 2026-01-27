import React from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import ProjectCard from './project-card';

async function getProjects(): Promise<Project[]> {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
}

export default async function PortfolioSection({ onProjectClick }: { onProjectClick: (project: Project) => void; }) {
    const projects = await getProjects();

  return (
    <section id="work" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Work</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
                A selection of my favorite projects. See something you like? Let&apos;s talk.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onClick={() => onProjectClick(project)} />
            ))}
        </div>
      </div>
    </section>
  );
}
