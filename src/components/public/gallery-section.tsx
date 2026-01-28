"use client";

import React, { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { GalleryImage } from '@/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const GallerySkeleton = () => (
  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
    {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
    ))}
  </div>
);

export default function GallerySection() {
  const firestore = useFirestore();

  const galleryQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'galleryImages'), orderBy('order', 'asc')) : null,
    [firestore]
  );

  const { data: images, isLoading } = useCollection<GalleryImage>(galleryQuery);

  if (isLoading) {
    return (
        <section id="gallery" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold tracking-tight">Gallery</h2>
                <p className="text-muted-foreground mt-2">A selection of my visual work.</p>
                </div>
                <GallerySkeleton />
            </div>
        </section>
    );
  }

  if (!images || images.length === 0) {
    return null; // Don't render the section if there are no images
  }
  
  return (
    <section id="gallery" className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold tracking-tight">Gallery</h2>
          <p className="text-muted-foreground mt-2">A selection of my visual work.</p>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 lg:gap-8 space-y-4 lg:space-y-8">
          {images.map((image, index) => (
            <div key={image.id} className="break-inside-avoid animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative overflow-hidden rounded-lg shadow-lg group">
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                 <div className="absolute inset-0 bg-black/20 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-semibold">{image.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

    