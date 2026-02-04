'use client';

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Testimonial } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function TestimonialSection() {
  const firestore = useFirestore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
  }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

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

  const testimonialsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'testimonials'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  if (isLoading) {
     return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <Skeleton className="h-12 w-12 mx-auto mb-8 rounded-full" />
                <Skeleton className="h-32 w-full mb-8" />
                <div className="flex items-center justify-center gap-4">
                     <Skeleton className="h-12 w-12 rounded-full" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                     </div>
                </div>
            </div>
        </section>
     )
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight animate-fade-in-up">Testimonials</h2>
            <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up animation-delay-300">What people say about working with me.</p>
        </div>

        <div className="embla w-full max-w-6xl mx-auto cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="embla__container flex items-center">
            {testimonials.map((testimonial, index) => {
               const isSelected = index === selectedIndex;
               return (
                <div
                    className={cn(
                        "embla__slide flex-[0_0_80%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0 pl-4 transition-all duration-500 ease-in-out",
                        isSelected ? "opacity-100 scale-100 blur-0 z-10" : "opacity-40 scale-90 blur-[2px] z-0"
                    )}
                    key={testimonial.id}
                >
                    <div className="flex flex-col items-center text-center p-6 md:p-10 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm mx-4">
                    <div className="bg-primary/10 p-3 rounded-full mb-6 text-primary">
                        <Quote className="h-6 w-6 md:h-8 md:w-8" />
                    </div>

                    <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-8 text-foreground/90 line-clamp-6">
                        &quot;{testimonial.content}&quot;
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto">
                        {testimonial.imageUrl ? (
                            <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                                <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-secondary flex items-center justify-center text-lg md:text-xl font-bold text-muted-foreground shrink-0">
                                {testimonial.name.charAt(0)}
                            </div>
                        )}
                        <div className="text-left">
                            <div className="font-semibold text-base md:text-lg">{testimonial.name}</div>
                            <div className="text-xs md:text-sm text-muted-foreground">
                                {testimonial.role}
                                {testimonial.company && <span> @ {testimonial.company}</span>}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
