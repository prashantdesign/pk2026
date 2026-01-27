"use client";

import React, { useEffect } from 'react';
import type { Project } from '@/types';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative bg-muted">
            <Carousel className="w-full h-full">
              <CarouselContent>
                {project.images && project.images.length > 0 ? (
                  project.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-[90vh]">
                        <Image src={img} alt={`${project.title} image ${index + 1}`} layout="fill" objectFit="contain" />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="relative w-full h-[90vh]">
                      <Image src={project.mainImageUrl} alt={`${project.title} main image`} layout="fill" objectFit="contain" />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
          <div className="p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <p className="text-muted-foreground mb-6">{project.shortDescription}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>

            {project.caseStudy && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">The Problem</h3>
                  <p>{project.caseStudy.problem}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">The Solution</h3>
                  <p>{project.caseStudy.solution}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Tools Used</h3>
                  <p>{project.caseStudy.tools}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">Outcome</h3>
                  <p>{project.caseStudy.outcome}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
