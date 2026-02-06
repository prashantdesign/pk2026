'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Testimonial } from '@/types';
import Image from 'next/image';
import LoadingLogo from '@/components/loading-logo';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/fade-in';
import { motion } from 'framer-motion';

export default function TestimonialSection() {
  const firestore = useFirestore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
  }, [Autoplay({ delay: 6000, stopOnInteraction: true })]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const testimonialsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'testimonials'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  if (isLoading) {
     return (
        <section className="py-24 bg-background flex items-center justify-center min-h-[500px]">
            <LoadingLogo />
        </section>
     )
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-background" id="testimonials">
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
            <div className="bg-secondary/30 rounded-[3rem] p-8 md:p-16 lg:p-24 relative overflow-hidden backdrop-blur-3xl border border-border/50">
                {/* Background Decor */}
                <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                     <motion.div
                        animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -45, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Badge */}
                <div className="flex justify-center mb-12">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/20 text-xs font-semibold tracking-widest uppercase text-foreground/70 bg-background/50 backdrop-blur-sm">
                        Testimonials
                    </span>
                </div>

                <div className="embla overflow-hidden" ref={emblaRef}>
                    <div className="embla__container flex">
                        {testimonials.map((testimonial) => (
                        <div
                            className="embla__slide flex-[0_0_100%] min-w-0"
                            key={testimonial.id}
                        >
                            <div className="flex flex-col items-center text-center max-w-4xl mx-auto cursor-grab active:cursor-grabbing">
                                <motion.blockquote
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed mb-8 text-foreground/90"
                                >
                                    &quot;{testimonial.content}&quot;
                                </motion.blockquote>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-muted-foreground mb-12"
                                >
                                    — {testimonial.name}, {testimonial.role} {testimonial.company && <span>at {testimonial.company}</span>}
                                </motion.div>

                                {testimonial.imageUrl && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                                        className="relative h-20 w-20 rounded-full overflow-hidden mb-8 border-4 border-background shadow-sm"
                                    >
                                        <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 hidden md:block">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-sm bg-background/80 hover:bg-background border border-border/50" onClick={scrollPrev}>
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </motion.div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12 hidden md:block">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-sm bg-background/80 hover:bg-background border border-border/50" onClick={scrollNext}>
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </motion.div>
                </div>

            </div>
        </FadeIn>
      </div>
    </section>
  );
}
