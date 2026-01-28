'use client';
import React, { useMemo, useState } from 'react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { GalleryImage, GalleryCategory } from '@/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function GallerySection() {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryCategories'), orderBy('order'));
  }, [firestore]);

  const imagesQuery = useMemo(() => {
    if (!firestore) return null;
    if (selectedCategory) {
        return query(collection(firestore, 'galleryImages'), where('galleryCategoryId', '==', selectedCategory), orderBy('order'));
    }
    return query(collection(firestore, 'galleryImages'), orderBy('order'));
  }, [firestore, selectedCategory]);

  const { data: categories, loading: categoriesLoading } = useCollection<GalleryCategory>(categoriesQuery);
  const { data: images, loading: imagesLoading } = useCollection<GalleryImage>(imagesQuery);

  const loading = categoriesLoading || imagesLoading;

  return (
    <section id="gallery" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Gallery</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          A curated collection of my visual explorations and design work.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-80" />
            <Skeleton className="h-64" />
            <Skeleton className="h-80" />
            <Skeleton className="h-64" />
            <Skeleton className="h-80" />
          </div>
        ) : (
          <>
            <div className="flex justify-center flex-wrap gap-2 mb-12">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="columns-2 md:columns-3 gap-4">
              {images?.map((image, index) => (
                <div key={image.id} className="mb-4 break-inside-avoid animate-fade-in-up" style={{ animationDelay: `${index * 100}ms`}}>
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
             {images?.length === 0 && (
                <p className="text-center text-muted-foreground">No images found for this category.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
