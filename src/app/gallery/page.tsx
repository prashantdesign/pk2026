"use client";

import React from 'react';
import type { SiteContent } from '@/types';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import Header from '@/components/public/header';
import Footer from '@/components/public/footer';
import GallerySection from '@/components/public/gallery-section';

export default function GalleryPage() {
  const firestore = useFirestore();

  const siteContentRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteContent', 'global') : null, [firestore]);
  const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background ${siteContent?.areAnimationsEnabled ? '' : 'no-animations'}`}>
      <Header siteName={siteContent?.siteName} />
      <main className="flex-grow pt-20">
        <GallerySection content={siteContent} showFilters={true} showViewAll={false} />
      </main>
      <Footer content={siteContent} />
    </div>
  );
}
