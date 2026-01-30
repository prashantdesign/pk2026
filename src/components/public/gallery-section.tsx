"use client";

import React, { useMemo, useState } from 'react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { SiteContent, GalleryImage, GalleryCategory } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SectionHeader from './section-header';
import { Skeleton } from '../ui/skeleton';

interface GallerySectionProps {
  content?: SiteContent | null;
}

export default function GallerySection({ content }: GallerySectionProps) {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryCategories'), orderBy('order', 'asc'));
  }, [firestore]);

  const imagesQuery = useMemo(() => {
    if (!firestore) return null;
    if (selectedCategory) {
      return query(
        collection(firestore, 'galleryImages'),
        where('galleryCategoryId', '==', selectedCategory),
        orderBy('order', 'asc')
      );
    }
    return query(collection(firestore, 'galleryImages'), orderBy('order', 'asc'));
  }, [firestore, selectedCategory]);

  const { data: categories, loading: categoriesLoading } = useCollection<GalleryCategory>(categoriesQuery);
  const { data: images, loading: imagesLoading } = useCollection<GalleryImage>(imagesQuery);

  const loading = categoriesLoading || imagesLoading;

  return (
    <section id="gallery" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <SectionHeader 
            title={content?.gallerySectionTitle}
            description={content?.gallerySectionDescription}
        />
        
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up animation-delay-300">
          <Button
            variant={!selectedCategory ? 'default' : 'secondary'}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square w-full overflow-hidden rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
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
        )}
      </div>
    </section>
  );
}

    