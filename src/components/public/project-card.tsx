'use client';

import React from 'react';
import Image from 'next/image';
import type { Project } from '@/types';
import { Card, CardContent } from '../ui/card';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }: { project: Project; onClick: () => void; }) {
  return (
    <Card 
        className="group overflow-hidden relative cursor-pointer border-2 border-border hover:border-primary transition-all duration-300"
        onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={project.mainImageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          <p className="text-primary font-semibold">{project.category}</p>
          <div className="flex items-center text-white mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            <span>View Project</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
