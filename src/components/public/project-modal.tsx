"use client";

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import type { Project } from '@/types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const tools = project.toolsUsed ? project.toolsUsed.split(',').map(tool => tool.trim()) : [];
  const allImages = [project.imageUrl, ...(project.projectImages || [])];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground pt-1">{project.description}</DialogDescription>
            </DialogHeader>

            <div className="py-6">
              {allImages.length > 1 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {allImages.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-[50vh] bg-muted rounded-lg overflow-hidden">
                           <Image src={img} alt={`${project.title} - Image ${index + 1}`} fill className="object-contain" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : (
                <div className="relative w-full h-[50vh] bg-muted rounded-lg overflow-hidden">
                  <Image src={project.imageUrl} alt={project.title} fill className="object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {project.problem && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">The Problem</h3>
                        <p className="text-muted-foreground">{project.problem}</p>
                    </div>
                )}
                 {project.solution && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">The Solution</h3>
                        <p className="text-muted-foreground">{project.solution}</p>
                    </div>
                )}
                 {project.outcome && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">The Outcome</h3>
                        <p className="text-muted-foreground">{project.outcome}</p>
                    </div>
                )}
              </div>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-semibold mb-2">Category</h3>
                    <p className="text-muted-foreground">{project.categoryId}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tools Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        <Icons name={tool} className="h-4 w-4" />
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
