'use client';
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';
import { Icons } from '../icons';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const allImages = [project.imageUrl, ...project.projectImages].filter(Boolean);
  const tools = project.toolsUsed?.split(',').map(tool => tool.trim().toLowerCase()) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <div className="grid md:grid-cols-2 h-full">
            <div className="relative h-full hidden md:block">
                <Carousel className="w-full h-full">
                <CarouselContent className="h-full">
                    {allImages.map((img, index) => (
                    <CarouselItem key={index} className="h-full">
                        <div className="relative w-full h-full">
                        <Image
                            src={img}
                            alt={`${project.title} image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                {allImages.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </>
                )}
                </Carousel>
            </div>
            <div className="flex flex-col h-full">
                <DialogHeader className="p-6 pb-4 flex-shrink-0">
                    <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                    <DialogDescription>{project.description}</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6">
                    {project.problem && (
                    <div>
                        <h4 className="font-semibold mb-2">The Problem</h4>
                        <p className="text-sm text-muted-foreground">{project.problem}</p>
                    </div>
                    )}
                    {project.solution && (
                    <div>
                        <h4 className="font-semibold mb-2">The Solution</h4>
                        <p className="text-sm text-muted-foreground">{project.solution}</p>
                    </div>
                    )}
                    {project.outcome && (
                    <div>
                        <h4 className="font-semibold mb-2">Outcome</h4>
                        <p className="text-sm text-muted-foreground">{project.outcome}</p>
                    </div>
                    )}
                    {tools.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Tools Used</h4>
                            <div className="flex flex-wrap gap-2">
                                {tools.map(tool => (
                                    <Badge key={tool} variant="secondary" className="flex items-center gap-2 capitalize py-1 px-3">
                                        <Icons name={tool} className="w-4 h-4" />
                                        {tool}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
