'use client';

import React from 'react';
import Image from 'next/image';
import type { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';

type ProjectModalProps = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const images = [project.imageUrl, ...(project.projectImages || [])];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <ScrollArea className="h-full pr-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
            <DialogDescription className="text-md text-muted-foreground">
              {project.description}
            </DialogDescription>
             <div className="flex flex-wrap gap-2 pt-2">
                {project.toolsUsed?.split(',').map(tool => (
                    <Badge key={tool} variant="secondary">{tool.trim()}</Badge>
                ))}
            </div>
          </DialogHeader>
          
          <Carousel className="w-full mb-8">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <Image src={img} alt={`${project.title} - image ${index + 1}`} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="space-y-8">
            {project.problem && (
              <div>
                <h3 className="text-2xl font-semibold mb-2">The Problem</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.problem}</p>
              </div>
            )}

            {project.solution && (
              <div>
                <h3 className="text-2xl font-semibold mb-2">The Solution</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.solution}</p>
              </div>
            )}
            
            {project.outcome && (
                 <>
                    <Separator />
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Outcome</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{project.outcome}</p>
                    </div>
                </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
