'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { TypingText } from '@/components/animations/typing-text';
import { FadeIn } from '@/components/animations/fade-in';
import { motion } from 'framer-motion';

const HeroSection = ({ content }: { content: SiteContent | null }) => {
  return (
    <section id="home" className="relative h-[calc(100vh-5rem)] min-h-[500px] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
             animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"
          />
      </div>

      <div className="container mx-auto flex h-full flex-col items-center justify-center text-center px-4 md:px-6 relative z-10">
        <div className="space-y-8 max-w-4xl">
          <TypingText
            text={content?.heroTitle || 'Creative Designer & Developer'}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
            delay={0.2}
          />

          <FadeIn delay={1.5} direction="up">
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {content?.heroSubtitle ||
                'I design and build beautiful and functional user experiences.'}
            </p>
          </FadeIn>

          {content?.ctaText && content.ctaLink && (
            <FadeIn delay={1.8} direction="up">
              <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25">
                  <a href={content.ctaLink}>
                    {content.ctaText}
                    <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
                  </a>
                </Button>
              </motion.div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
