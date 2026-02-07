'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import type { GalleryImage } from '@/types';
import { X } from 'lucide-react';

interface GalleryModalProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ images, initialIndex, isOpen, onClose }: GalleryModalProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
    // Jump to the clicked image
    api.scrollTo(initialIndex, true);
  }, [api, initialIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-xl h-screen md:h-[90vh] p-0 border-none bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50 text-white">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            {images.map((img) => (
              <CarouselItem key={img.id} className="h-full pl-0 flex items-center justify-center relative">
                 {/* Blurred Background Layer for "Smart Fill" effect */}
                 <div className="absolute inset-0 w-full h-full -z-10">
                    <Image
                        src={img.imageUrl}
                        alt=""
                        fill
                        className="object-cover opacity-20 blur-3xl scale-110"
                        aria-hidden="true"
                    />
                </div>

                <div className="relative w-full h-full max-h-[85vh] p-4 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={img.imageUrl}
                      alt={img.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12" />
              <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none h-12 w-12" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
