'use client';
import React from 'react';
import { Award, Briefcase, Smile, Star } from 'lucide-react';

const stats = [
  { value: '5+', label: 'Years of Experience', icon: Star },
  { value: '100+', label: 'Projects Completed', icon: Briefcase },
  { value: '50+', label: 'Happy Clients', icon: Smile },
  { value: '3', label: 'Design Awards', icon: Award },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <stat.icon className="w-10 h-10 text-primary mb-2"/>
              <h3 className="text-4xl font-bold">{stat.value}</h3>
              <p className="text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
