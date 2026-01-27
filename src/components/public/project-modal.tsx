'use client';

import React from 'react';
import type { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Icons } from '../icons';
import { X } from 'lucide-react';

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 !rounded-lg">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-4xl font-bold">{project.title}</DialogTitle>
              <DialogDescription className="text-lg text-primary">{project.category}</DialogDescription>
            </DialogHeader>

            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8">
              <Image src={project.mainImageUrl} alt={project.title} fill className="object-cover" />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            
            <p className="text-lg text-foreground/80 mb-8">{project.shortDescription}</p>

            {project.caseStudy && (
              <div className="space-y-8">
                <Separator />
                <CaseStudySection title="The Problem" content={project.caseStudy.problem} />
                <CaseStudySection title="The Solution" content={project.caseStudy.solution} />
                <CaseStudySection title="Outcome" content={project.caseStudy.outcome} />

                <div>
                    <h4 className="text-xl font-semibold mb-4">Tools Used</h4>
                    <div className="flex flex-wrap gap-4">
                        {project.caseStudy.tools.split(',').map(tool => tool.trim()).map((tool) => (
                            <div key={tool} className="flex items-center gap-2 p-2 rounded-md bg-secondary">
                                <Icons name={tool} className="w-6 h-6" />
                                <span className="font-medium">{tool}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}
            
            {project.images && project.images.length > 0 && (
                <div className="mt-8">
                    <Separator />
                    <h4 className="text-xl font-semibold my-6">More Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.images.map((img, index) => (
                            <div key={index} className="relative aspect-video w-full rounded-lg overflow-hidden">
                                <Image src={img} alt={`${project.title} image ${index + 1}`} fill className="object-cover"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function CaseStudySection({ title, content }: { title: string; content?: string }) {
  if (!content) return null;
  return (
    <div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-foreground/80 whitespace-pre-wrap">{content}</p>
    </div>
  );
}
