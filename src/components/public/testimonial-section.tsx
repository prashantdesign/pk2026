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
        <div className="bg-secondary/30 rounded-[3rem] p-8 md:p-16 lg:p-24 relative overflow-hidden">

             {/* Badge */}
             <div className="flex justify-center mb-12">
                 <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-foreground/20 text-xs font-semibold tracking-widest uppercase text-foreground/70 bg-background/50">
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
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed mb-8 text-foreground/90">
                                &quot;{testimonial.content}&quot;
                            </blockquote>

                            <div className="text-muted-foreground mb-12">
                                — {testimonial.name}, {testimonial.role} {testimonial.company && <span>at {testimonial.company}</span>}
                            </div>

                            {testimonial.imageUrl && (
                                <div className="relative h-20 w-20 rounded-full overflow-hidden mb-8 border-4 border-background shadow-sm">
                                    <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12">
                 <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-sm bg-background/80 hover:bg-background" onClick={scrollPrev}>
                     <ChevronLeft className="h-6 w-6" />
                 </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-12">
                 <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-sm bg-background/80 hover:bg-background" onClick={scrollNext}>
                     <ChevronRight className="h-6 w-6" />
                 </Button>
            </div>

        </div>
      </div>
    </section>
  );
}
