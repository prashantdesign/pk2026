'use client';
import React from 'react';
import type { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {

  const allImages = [project.mainImageUrl, ...(project.images || [])];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh]">
        <ScrollArea className="h-full pr-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
            <DialogDescription>{project.shortDescription}</DialogDescription>
          </DialogHeader>

          <Carousel className="w-full mb-8">
            <CarouselContent>
              {allImages.map((img, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-0">
                      <Image src={img} alt={`${project.title} image ${index + 1}`} width={1280} height={720} className="rounded-lg object-cover"/>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             <div>
                <h4 className="font-semibold mb-2 text-lg">Category</h4>
                <Badge variant="outline">{project.category}</Badge>
             </div>
             <div>
                <h4 className="font-semibold mb-2 text-lg">Tags</h4>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                </div>
             </div>
             {project.caseStudy?.tools && (
                <div>
                    <h4 className="font-semibold mb-2 text-lg">Tools Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.caseStudy.tools.split(',').map(tool => (
                            <div key={tool.trim()} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icons name={tool.trim()} className="w-5 h-5"/>
                                <span>{tool.trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>
             )}
          </div>
          
          {project.caseStudy && (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold border-b pb-2">Case Study</h3>
                {project.caseStudy.problem && (
                    <div>
                        <h4 className="font-semibold mb-2 text-lg">The Problem</h4>
                        <p className="text-muted-foreground leading-relaxed">{project.caseStudy.problem}</p>
                    </div>
                )}
                {project.caseStudy.solution && (
                    <div>
                        <h4 className="font-semibold mb-2 text-lg">The Solution</h4>
                        <p className="text-muted-foreground leading-relaxed">{project.caseStudy.solution}</p>
                    </div>
                )}
                 {project.caseStudy.outcome && (
                    <div>
                        <h4 className="font-semibold mb-2 text-lg">Outcome</h4>
                        <p className="text-muted-foreground leading-relaxed">{project.caseStudy.outcome}</p>
                    </div>
                )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
