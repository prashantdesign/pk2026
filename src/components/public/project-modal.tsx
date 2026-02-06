'use client';

import React from 'react';
import type { Project } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Icons } from '../icons';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const allImages = [project.imageUrl, ...(project.projectImages || [])].filter(Boolean);
  const tools = project.toolsUsed ? project.toolsUsed.split(',').map(tool => tool.trim()) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-background/95 backdrop-blur-xl border-border/50">

        {/* Left Side: Images */}
        <div className="w-full md:w-[60%] h-[40vh] md:h-full relative flex items-center justify-center overflow-hidden bg-background">
            {allImages.length > 0 ? (
                <Carousel className="w-full h-full group">
                    <CarouselContent className="h-full ml-0">
                        {allImages.map((img, index) => (
                            <CarouselItem key={index} className="h-full pl-0 relative overflow-hidden">
                                {/* Blurred Background Layer */}
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        src={img}
                                        alt=""
                                        fill
                                        className="object-cover opacity-30 blur-xl scale-110"
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Main Image Layer */}
                                <div className="relative w-full h-full z-10 flex items-center justify-center p-4">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={img}
                                            alt={`${project.title} image ${index + 1}`}
                                            fill
                                            className="object-contain shadow-2xl rounded-sm"
                                            priority={index === 0}
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {allImages.length > 1 && (
                        <>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <CarouselPrevious className="static h-10 w-10 bg-black/20 hover:bg-black/40 text-white border-none backdrop-blur-sm" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <CarouselNext className="static h-10 w-10 bg-black/20 hover:bg-black/40 text-white border-none backdrop-blur-sm" />
                            </div>
                        </>
                    )}
                </Carousel>
            ) : (
                <div className="text-muted-foreground flex items-center justify-center h-full w-full bg-muted/20">
                    No images available
                </div>
            )}
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-[40%] h-[60vh] md:h-full flex flex-col bg-background relative border-l border-border/50">
            <ScrollArea className="flex-grow">
                <div className="p-6 md:p-8 space-y-8">
                    <div>
                        <DialogTitle className="text-3xl font-bold tracking-tight mb-3 text-foreground">
                            {project.title}
                        </DialogTitle>

                        <DialogDescription className="sr-only">
                            Details about {project.title} project
                        </DialogDescription>

                        {project.description && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        )}

                        {/* Tools */}
                        <div className="flex flex-wrap gap-2 mt-6">
                             {tools.map(tool => (
                                <Badge key={tool} variant="secondary" className="text-xs px-2.5 py-1 flex items-center gap-1.5 rounded-md">
                                    <Icons name={tool} className="h-3 w-3" />
                                    {tool}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8 pt-4 border-t border-border/40">
                         {project.problem && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-base font-semibold flex items-center gap-2 text-primary mb-2 uppercase tracking-wide text-xs">
                                    The Challenge
                                </h3>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {project.problem}
                                </p>
                            </div>
                        )}

                        {project.solution && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-base font-semibold flex items-center gap-2 text-primary mb-2 uppercase tracking-wide text-xs">
                                    The Solution
                                </h3>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {project.solution}
                                </p>
                            </div>
                        )}

                         {project.outcome && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-base font-semibold flex items-center gap-2 text-primary mb-2 uppercase tracking-wide text-xs">
                                    The Outcome
                                </h3>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {project.outcome}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
