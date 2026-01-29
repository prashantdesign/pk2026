'use client';
import React, { useState, useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { GalleryImage, GalleryCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const GallerySection = () => {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const imagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryImages'), orderBy('order'));
  }, [firestore]);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryCategories'), orderBy('order'));
  }, [firestore]);

  const { data: images, isLoading: imagesLoading } = useCollection<GalleryImage>(imagesQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<GalleryCategory>(categoriesQuery);

  const filteredImages = useMemo(() => {
    if (!images) return [];
    if (selectedCategory === 'all') return images;
    return images.filter(image => image.galleryCategoryId === selectedCategory);
  }, [images, selectedCategory]);

  const loading = imagesLoading || categoriesLoading;

  if (loading && !images && !categories) {
    return (
        <section id="gallery" className="py-24 bg-secondary">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Gallery</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
                 </div>
            </div>
        </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Gallery</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-center">A collection of my visual explorations and creative works.</p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 mb-8 animate-fade-in-up animation-delay-300">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories?.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in-up"
              style={{ animationDelay: `${(index % 8) * 100}ms` }}
            >
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-center p-2">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
