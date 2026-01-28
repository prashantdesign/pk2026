'use client';

import React from 'react';
import { Briefcase, Clock, Users, Award } from 'lucide-react';

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
  <div className="flex flex-col items-center text-center">
    <Icon className="h-10 w-10 text-primary mb-3" />
    <p className="text-4xl font-bold">{value}</p>
    <p className="text-muted-foreground">{label}</p>
  </div>
);

const StatsSection = () => {
  // In a real app, this data would likely come from the CMS/Firestore
  const stats = [
    { icon: Briefcase, value: '50+', label: 'Projects Completed' },
    { icon: Clock, value: '5+', label: 'Years of Experience' },
    { icon: Users, value: '30+', label: 'Happy Clients' },
    { icon: Award, value: '10', label: 'Awards Won' },
  ];

  return (
    <section id="stats" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
