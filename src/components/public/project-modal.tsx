'use client';

import React from 'react';
import type { Project } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const allImages = [project.imageUrl, ...project.projectImages].filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 -mr-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-4">
                <div className="md:col-span-3">
                    <Carousel>
                        <CarouselContent>
                        {allImages.map((img, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image src={img} alt={`${project.title} - image ${index + 1}`} fill className="object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        {allImages.length > 1 && (
                            <>
                                <CarouselPrevious className="absolute left-2" />
                                <CarouselNext className="absolute right-2" />
                            </>
                        )}
                    </Carousel>
                </div>
                <div className="md:col-span-2 space-y-4">
                     <div className="space-y-1">
                        <h4 className="font-semibold">Category</h4>
                        <Badge variant="secondary">{project.categoryId}</Badge>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold">Tools Used</h4>
                        <div className="flex flex-wrap gap-2">
                             {project.toolsUsed?.split(',').map(tool => tool.trim()).map(tool => (
                                <div key={tool} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Icons name={tool} className="w-4 h-4"/>
                                    <span>{tool}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 space-y-6 prose prose-lg dark:prose-invert max-w-none">
                {project.problem && (
                    <div>
                        <h3>The Problem</h3>
                        <p>{project.problem}</p>
                    </div>
                )}
                {project.solution && (
                    <div>
                        <h3>The Solution</h3>
                        <p>{project.solution}</p>
                    </div>
                )}
                {project.outcome && (
                    <div>
                        <h3>Outcome</h3>
                        <p>{project.outcome}</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
