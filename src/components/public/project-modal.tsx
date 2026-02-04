'use client';

import React from 'react';
import type { Project } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Icons } from '../icons';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
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
      <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col sm:flex-row bg-background/95 backdrop-blur-xl border-border/50">

        {/* Left Side: Images */}
        <div className="w-full sm:w-1/2 h-[40vh] sm:h-full bg-black/5 relative flex items-center justify-center p-4">
            {allImages.length > 0 ? (
                <Carousel className="w-full h-full">
                    <CarouselContent className="h-full ml-0">
                        {allImages.map((img, index) => (
                            <CarouselItem key={index} className="h-full pl-0 relative">
                                <div className="relative w-full h-full min-h-[300px]">
                                    <Image
                                        src={img}
                                        alt={`${project.title} image ${index + 1}`}
                                        fill
                                        className="object-contain"
                                        priority={index === 0}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-black/50 text-white border-none hover:bg-black/70" />
                            <CarouselNext className="static translate-y-0 h-8 w-8 bg-black/50 text-white border-none hover:bg-black/70" />
                        </div>
                    )}
                </Carousel>
            ) : (
                <div className="text-muted-foreground flex items-center justify-center h-full w-full">
                    No images available
                </div>
            )}
        </div>

        {/* Right Side: Content */}
        <div className="w-full sm:w-1/2 h-[60vh] sm:h-full flex flex-col bg-background relative">
             {/* Note: DialogContent from UI library often includes a close button by default.
                 If you see two close buttons, it's because of that.
                 The default one in DialogContent is usually positioned absolutely at top-right.
                 We will suppress our custom one if the library provides one, or ensure the library one is hidden via CSS if we prefer ours.
                 Looking at the provided screenshot, there's an 'X' at top right which seems to be the default Radix/shadcn close button.
                 So we will REMOVE this custom button to avoid duplication.
             */}

            <ScrollArea className="flex-grow">
                <div className="p-6 sm:p-8 space-y-8">
                    <div>
                        <DialogTitle className="text-3xl font-bold tracking-tight mb-3 text-foreground">
                            {project.title}
                        </DialogTitle>

                        <DialogDescription className="sr-only">
                            Details about {project.title} project
                        </DialogDescription>

                        {project.description && (
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        )}

                        {/* Categories/Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {/* Assuming category name is fetched or passed. Using ID for now if needed, or just skipping */}
                             {/* Tools */}
                             {tools.map(tool => (
                                <Badge key={tool} variant="outline" className="text-xs px-2 py-1 flex items-center gap-1.5">
                                    <Icons name={tool} className="h-3 w-3" />
                                    {tool}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                         {project.problem && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                    The Challenge
                                </h3>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {project.problem}
                                </p>
                            </div>
                        )}

                        {project.solution && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                    The Solution
                                </h3>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {project.solution}
                                </p>
                            </div>
                        )}

                         {project.outcome && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
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
