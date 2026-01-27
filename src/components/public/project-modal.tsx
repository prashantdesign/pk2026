"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const allImages = [project.mainImageUrl, ...(project.images || [])];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>{project.shortDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 -mr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Carousel>
                    <CarouselContent>
                        {allImages.map((img, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-video relative rounded-lg overflow-hidden">
                                <Image src={img} alt={`${project.title} - image ${index + 1}`} layout="fill" objectFit="cover" />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                    </Carousel>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold">Category</h3>
                    <Badge variant="secondary">{project.category}</Badge>
                    
                    <h3 className="font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            {project.caseStudy && (
                <div className="mt-8">
                    <Separator className="my-4" />
                    <h3 className="text-xl font-bold mb-4">Case Study</h3>
                    <div className="space-y-6 text-sm text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">The Problem</h4>
                            <p>{project.caseStudy.problem}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">The Solution</h4>
                            <p>{project.caseStudy.solution}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Tools Used</h4>
                            <p>{project.caseStudy.tools}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-foreground mb-2">Outcome</h4>
                            <p>{project.caseStudy.outcome}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
