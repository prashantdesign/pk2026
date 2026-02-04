"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { convertGoogleDriveLink } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import type { Testimonial } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("A valid image URL is required").optional().or(z.literal('')),
  order: z.coerce.number(),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

function saveTestimonial(firestore: any, testimonialId: string | undefined, data: any) {
  const testimonialData = { ...data, updatedAt: serverTimestamp() };
  if (testimonialId) {
    const testimonialRef = doc(firestore, 'testimonials', testimonialId);
    setDoc(testimonialRef, testimonialData, { merge: true }).catch(async (serverError: any) => {
        const permissionError = new FirestorePermissionError({
          path: testimonialRef.path,
          operation: 'update',
          requestResourceData: testimonialData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  } else {
    const collRef = collection(firestore, 'testimonials');
    const finalData = { ...testimonialData, createdAt: serverTimestamp() };
    addDoc(collRef, finalData).catch(async (serverError: any) => {
        const permissionError = new FirestorePermissionError({
          path: collRef.path,
          operation: 'create',
          requestResourceData: finalData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }
}

export default function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<TestimonialFormValues> = {
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    imageUrl: testimonial?.imageUrl || '',
    order: testimonial?.order || 0,
  };

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>, field: any) => {
    const convertedUrl = convertGoogleDriveLink(e.target.value);
    field.onChange(convertedUrl);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
          const downloadURL = await uploadToCloudinary(file);
          form.setValue('imageUrl', downloadURL, { shouldValidate: true });
          toast({title: "Image uploaded successfully"});
      } catch (error: any) {
          toast({variant: "destructive", title: "Image upload failed", description: error.message});
          console.error("Cloudinary upload error: ", error);
      } finally {
          setIsUploading(false);
      }
  }

  const onSubmit = (data: TestimonialFormValues) => {
    if(!firestore) {
        toast({ variant: "destructive", title: "Firestore not available" });
        return;
    }
    setIsSaving(true);
    saveTestimonial(firestore, testimonial?.id, data);
    toast({
      title: testimonial ? "Testimonial Updated" : "Testimonial Created",
      description: "Your testimonial has been saved successfully.",
    });
    router.push('/admin/testimonials');
    router.refresh();
    setIsSaving(false);
  };

  const imageUrl = form.watch('imageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="company" render={({ field }) => (
              <FormItem><FormLabel>Company (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem><FormLabel>Testimonial Content</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="space-y-2 p-4 border rounded-lg max-w-xl">
            <FormLabel className="font-semibold">Author Image</FormLabel>
            <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="pt-4">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} onBlur={(e) => handleUrlBlur(e, field)} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                </TabsContent>
                <TabsContent value="upload" className="pt-4">
                <FormItem>
                    <FormLabel>Upload an image file</FormLabel>
                    <FormControl>
                    <Input type="file" onChange={handleImageUpload} disabled={isUploading} />
                    </FormControl>
                    {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                    <FormMessage />
                </FormItem>
                </TabsContent>
            </Tabs>
            {imageUrl && (
                <div className="mt-4">
                <FormLabel>Preview</FormLabel>
                <div className="mt-2 relative h-24 w-24 bg-muted rounded-full overflow-hidden">
                    <Image src={imageUrl} alt="Author image preview" fill className="object-cover" />
                </div>
                </div>
            )}
        </div>

        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? 'Saving...' : 'Save Testimonial'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
