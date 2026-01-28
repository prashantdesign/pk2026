'use client';

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { GalleryImage, GalleryCategory } from '@/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function GallerySection() {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoriesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'galleryCategories'), orderBy('order')) : null
  , [firestore]);
  const { data: categories, loading: categoriesLoading } = useCollection<GalleryCategory>(categoriesQuery);

  const allImagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryImages'), orderBy('order'));
  }, [firestore]);

  const { data: allImages, isLoading: imagesLoading } = useCollection<GalleryImage>(allImagesQuery);
  
  const filteredImages = useMemo(() => {
    if (!allImages) return [];
    if (selectedCategory === 'all') return allImages;
    return allImages.filter(p => p.galleryCategoryId === selectedCategory);
  }, [allImages, selectedCategory]);

  const loading = categoriesLoading || imagesLoading;

  return (
    <section id="gallery" className="bg-muted/40">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Gallery</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A collection of my visual work and inspiration.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-12 animate-fade-in-up animation-delay-300">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
            <div className="columns-2 md:columns-3 gap-4">
                <Skeleton className="h-64 mb-4" />
                <Skeleton className="h-96 mb-4" />
                <Skeleton className="h-80 mb-4" />
                <Skeleton className="h-96 mb-4" />
                <Skeleton className="h-64 mb-4" />
                <Skeleton className="h-80 mb-4" />
            </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {filteredImages?.map((image, index) => (
              <div
                key={image.id}
                className="mb-4 break-inside-avoid animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="group relative overflow-hidden rounded-lg">
                    <Image
                    src={image.imageUrl}
                    alt={image.title}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-semibold">{image.title}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
        { !loading && filteredImages?.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No images found in this category.</p>
        )}
      </div>
    </section>
  );
}
