"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { GalleryImage } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("A valid image URL is required"),
  order: z.coerce.number().default(0),
});

type GalleryFormValues = z.infer<typeof formSchema>;

function saveGalleryImage(firestore: any, imageId: string | undefined, data: any) {
  const imageData = { ...data, updatedAt: serverTimestamp() };
  if (imageId) {
    const imageRef = doc(firestore, 'galleryImages', imageId);
    setDoc(imageRef, imageData, { merge: true }).catch(async (serverError: any) => {
        const permissionError = new FirestorePermissionError({
          path: imageRef.path,
          operation: 'update',
          requestResourceData: imageData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  } else {
    const collRef = collection(firestore, 'galleryImages');
    const finalData = { ...imageData, createdAt: serverTimestamp() };
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

export default function GalleryForm({ image }: { image?: GalleryImage }) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<GalleryFormValues> = {
    title: image?.title || '',
    imageUrl: image?.imageUrl || '',
    order: image?.order || 0,
  };

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);

      try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          form.setValue('imageUrl', downloadURL, { shouldValidate: true });
          toast({title: "Image uploaded successfully"});
      } catch (error) {
          toast({variant: "destructive", title: "Image upload failed"});
          console.error("Image upload error: ", error);
      } finally {
          setIsUploading(false);
      }
  }

  const onSubmit = (data: GalleryFormValues) => {
    if(!firestore) {
        toast({ variant: "destructive", title: "Firestore not available" });
        return;
    }
    setIsSaving(true);
    saveGalleryImage(firestore, image?.id, data);
    toast({
      title: image ? "Image Updated" : "Image Added",
      description: "Your gallery image has been saved.",
    });
    router.push('/admin/gallery');
    router.refresh();
    setIsSaving(false);
  };
  
  const imageUrl = form.watch('imageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Image Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="order" render={({ field }) => (
            <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="space-y-4">
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div>
                <FormLabel>Or Upload Image</FormLabel>
                <Input type="file" onChange={handleImageUpload} disabled={isUploading}/>
                {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
            </div>
            {imageUrl && (
              <div className="mt-4">
                <FormLabel>Image Preview</FormLabel>
                <div className="mt-2 relative aspect-video w-full max-w-sm">
                    <Image src={imageUrl} alt="Image preview" fill className="rounded-md object-contain" />
                </div>
              </div>
            )}
        </div>


        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? 'Saving...' : 'Save Image'}
        </Button>
      </form>
    </Form>
  );
}

    