'use client';

import React, { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Testimonial } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialSection() {
  const firestore = useFirestore();
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

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

        <div className="embla max-w-4xl mx-auto cursor-grab active:cursor-grabbing animate-fade-in-up animation-delay-600" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.map((testimonial) => (
              <div className="embla__slide flex-[0_0_100%] min-w-0 pl-4" key={testimonial.id}>
                <div className="flex flex-col items-center text-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mb-6 text-primary">
                    <Quote className="h-8 w-8" />
                  </div>

                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-foreground/90">
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto">
                    {testimonial.imageUrl ? (
                        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20">
                            <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground">
                            {testimonial.name.charAt(0)}
                        </div>
                    )}
                    <div className="text-left">
                        <div className="font-semibold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                            {testimonial.company && <span> @ {testimonial.company}</span>}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
