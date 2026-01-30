import React from 'react';
import type { SiteContent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface ToolsSectionProps {
  content: SiteContent | null;
}

export default function ToolsSection({ content }: ToolsSectionProps) {
  if (!content || !content.tools || content.tools.length === 0) {
    return null;
  }

  return (
    <section id="tools" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{content.toolsSectionTitle || 'Tools I Use'}</h2>
            {content.toolsSectionDescription && (
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {content.toolsSectionDescription}
              </p>
            )}
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center justify-center gap-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {content.tools.map((tool, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-2">
              <div className="relative h-16 w-16 bg-white rounded-lg p-2 flex items-center justify-center">
                <Image
                  src={tool.iconUrl}
                  alt={`${tool.name} icon`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
