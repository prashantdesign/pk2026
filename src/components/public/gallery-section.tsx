'use client';
import React, { useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { GalleryImage } from '@/types';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

export default function GallerySection() {
    const firestore = useFirestore();

    const galleryQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'galleryImages'), orderBy('order', 'asc'));
    }, [firestore]);

    const { data: images, loading } = useCollection<GalleryImage>(galleryQuery);

    if (loading) {
        return (
            <section id="gallery" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full md:hidden" />
                    </div>
                </div>
            </section>
        )
    }

    if (!images || images.length === 0) {
        return null; // Don't render the section if there are no images
    }

    return (
        <section id="gallery" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up">Gallery</h2>
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                    {images.map((image, index) => (
                        <div key={image.id} className="break-inside-avoid animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
            </div>
        </section>
    );
}
