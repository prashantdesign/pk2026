'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Project } from '@/types';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Icons } from '../icons';
import { ScrollArea } from '../ui/scroll-area';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const tools = project.toolsUsed?.split(',').map(tool => tool.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="h-full">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold mb-2">{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image src={project.imageUrl} alt={project.title} fill className="object-contain" />
                  </div>
                </CarouselItem>
                {project.projectImages?.map((imgUrl, index) => (
                  <CarouselItem key={index}>
                     <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image src={imgUrl} alt={`${project.title} - image ${index + 1}`} fill className="object-contain" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {(project.projectImages?.length ?? 0) > 0 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {project.problem && (
              <div>
                <h4 className="font-semibold text-lg mb-2">The Problem</h4>
                <p className="text-muted-foreground">{project.problem}</p>
              </div>
            )}
            {project.solution && (
               <div>
                <h4 className="font-semibold text-lg mb-2">The Solution</h4>
                <p className="text-muted-foreground">{project.solution}</p>
              </div>
            )}
            {project.outcome && (
              <div>
                <h4 className="font-semibold text-lg mb-2">The Outcome</h4>
                <p className="text-muted-foreground">{project.outcome}</p>
              </div>
            )}
          </div>

          {tools && tools.length > 0 && (
            <div>
                <h4 className="font-semibold text-lg mb-2">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                    {tools.map((tool, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1.5">
                            <Icons name={tool} className="w-3 h-3" />
                            {tool}
                        </Badge>
                    ))}
                </div>
            </div>
          )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
