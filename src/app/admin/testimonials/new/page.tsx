import React from 'react';
import TestimonialForm from '@/components/admin/testimonial-form';

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add Testimonial</h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
