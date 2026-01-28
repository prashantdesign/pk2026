'use client';
import React from 'react';
import { SiteContent } from '@/types';

interface StatsSectionProps {
  content?: Partial<SiteContent>;
}

const StatsSection: React.FC<StatsSectionProps> = ({ content }) => {
    const stats = content?.stats?.length ? content.stats : [
        { value: '5+', label: 'Years Experience' },
        { value: '100+', label: 'Projects Done' },
        { value: '99%', label: 'Happy Clients' },
    ];

    if (!stats || stats.length === 0) {
      return null;
    }

  return (
    <section id="stats" className="py-20 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-lg shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className="text-5xl font-bold text-primary">{stat.value}</h3>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
