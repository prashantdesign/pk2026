'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Counter } from '@/components/animations/counter';
import { StaggerContainer, staggerItem } from '@/components/animations/stagger-container';
import { motion } from 'framer-motion';

const StatsSection = ({ content }: { content: SiteContent | null }) => {
  if (!content?.stats || content.stats.length === 0) {
    return null;
  }

  return (
    <section id="stats" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {content.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="p-6 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/10 hover:border-primary/20 transition-colors"
            >
              <p className="text-5xl md:text-6xl font-bold text-primary mb-2">
                  <Counter value={stat.value} />
              </p>
              <p className="text-lg text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default StatsSection;
