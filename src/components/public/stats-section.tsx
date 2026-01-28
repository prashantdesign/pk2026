'use client';
import React from 'react';
import type { SiteContent } from '@/types';

interface StatsSectionProps {
    content?: SiteContent | null;
}

export default function StatsSection({ content }: StatsSectionProps) {
  if (!content?.stats || content.stats.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/40">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {content.stats.map((stat, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${200 * index}ms`}}>
              <p className="text-4xl sm:text-5xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-lg text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
