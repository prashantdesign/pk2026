'use client';

import React from 'react';
import type { SiteContent } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/fade-in';
import { TypingText } from '@/components/animations/typing-text';
import Image from 'next/image';

interface HeroSectionProps {
  content: SiteContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-20 animation-delay-2000" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <FadeIn>
          <div className="mb-6 relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background shadow-xl glow-strong">
            {content?.heroImage ? (
                <Image
                    src={content.heroImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                </div>
            )}
          </div>
        </FadeIn>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="block mb-2 animate-fade-in-up">
            {content?.heroTitle || "Hi, I'm a Designer"}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 animate-fade-in-up animation-delay-300 glow-text">
            <TypingText text={content?.heroSubtitle || "Building Digital Experiences"} delay={1000} />
          </span>
        </h1>

        <FadeIn delay={0.6}>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {content?.heroDescription || "I create beautiful and functional websites for businesses and individuals."}
          </p>
        </FadeIn>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" variant="glow" className="min-w-[160px]">
            <Link href="#work">
              {content?.heroCtaText || "View My Work"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[160px] hover:glow-outline transition-all duration-300">
            <Link href="#contact">
              Contact Me
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
