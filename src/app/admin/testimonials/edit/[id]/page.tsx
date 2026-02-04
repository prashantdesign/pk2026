'use client';

import React from 'react';
import TestimonialForm from '@/components/admin/testimonial-form';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Testimonial } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

export default function EditTestimonialPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const docRef = firestore && id ? doc(firestore, 'testimonials', id as string) : null;
  const { data: testimonial, loading, error } = useDoc<Testimonial>(docRef);

  if (loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-[500px] w-full" />
        </div>
    );
  }

  if (error || !testimonial) {
    return <div>Error loading testimonial or not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Testimonial</h1>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
