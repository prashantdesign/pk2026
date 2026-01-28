"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '../ui/skeleton';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SiteContent } from '@/types';

const formSchema = z.object({
  heroTitle: z.string().min(1, "Title is required."),
  heroSubtitle: z.string().min(1, "Subtitle is required."),
  ctaText: z.string(),
  ctaLink: z.string(),
  
  aboutText: z.string().min(1, "Bio is required."),
  
  theme: z.enum(['light', 'dark']).default('dark'),

  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  aboutImageUrl: z.string().url("A valid image URL is required.").optional().or(z.literal('')),
});


export default function SiteContentForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const firestore = useFirestore();

  const siteContentRef = useMemo(() => firestore ? doc(firestore, 'siteContent', 'global') : null, [firestore]);
  const { data: siteContent, loading: isFetching } = useDoc<SiteContent>(siteContentRef as any);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      ctaText: "",
      ctaLink: "",
      aboutText: "",
      theme: 'dark',
      linkedin: "",
      twitter: "",
      instagram: "",
      email: "",
      aboutImageUrl: ""
    },
  });

  useEffect(() => {
    if (siteContent) {
      form.reset({
        heroTitle: siteContent.heroTitle,
        heroSubtitle: siteContent.heroSubtitle,
        ctaText: siteContent.ctaText,
        ctaLink: siteContent.ctaLink,
        aboutText: siteContent.aboutText,
        theme: (siteContent as any).theme || 'dark',
        linkedin: siteContent.socials?.linkedin,
        twitter: siteContent.socials?.twitter,
        instagram: siteContent.socials?.instagram,
        email: siteContent.socials?.email,
        aboutImageUrl: siteContent.aboutImageUrl,
      });
    }
  }, [siteContent, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `siteContent/${Date.now()}_${file.name}`);

      try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          form.setValue('aboutImageUrl', downloadURL);
          toast({title: "Image uploaded successfully"});
      } catch (error) {
          toast({variant: "destructive", title: "Image upload failed"});
      } finally {
          setIsUploading(false);
      }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if(!firestore || !siteContentRef) return;
    setIsLoading(true);

    const dataToSave = {
      heroTitle: values.heroTitle,
      heroSubtitle: values.heroSubtitle,
      ctaText: values.ctaText,
      ctaLink: values.ctaLink,
      aboutText: values.aboutText,
      theme: values.theme,
      aboutImageUrl: values.aboutImageUrl,
      socials: {
        linkedin: values.linkedin,
        twitter: values.twitter,
        instagram: values.instagram,
        email: values.email,
      }
    };

    setDoc(siteContentRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "Content Updated",
                description: "Your website content has been saved successfully.",
              });
        })
        .catch(async (serverError) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem saving your content.",
              });
            const permissionError = new FirestorePermissionError({
              path: siteContentRef.path,
              operation: 'update',
              requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsLoading(false);
        });
  };

  if (isFetching) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['hero', 'about', 'theme', 'socials']} className="w-full">
          <AccordionItem value="hero">
            <AccordionTrigger className="text-xl font-semibold">Hero Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ctaText" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ctaLink" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Link</FormLabel><FormControl><Input {...field} placeholder="#work" /></FormControl><FormMessage /></FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="about">
            <AccordionTrigger className="text-xl font-semibold">About Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="aboutText" render={({ field }) => (
                <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="aboutImageUrl" render={({ field }) => (
                <FormItem><FormLabel>Your Picture URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div>
                <FormLabel>Or Upload Your Picture</FormLabel>
                <Input type="file" onChange={handleImageUpload} disabled={isUploading}/>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="theme">
            <AccordionTrigger className="text-xl font-semibold">Site Theme</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose a theme for your public website</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="light" />
                          </FormControl>
                          <FormLabel className="font-normal">Light</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="dark" />
                          </FormControl>
                          <FormLabel className="font-normal">Dark</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="socials">
            <AccordionTrigger className="text-xl font-semibold">Contact & Socials</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input placeholder="your.email@example.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="linkedin" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="twitter" render={({ field }) => (
                  <FormItem><FormLabel>Twitter URL</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="instagram" render={({ field }) => (
                  <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Content'}</Button>
      </form>
    </Form>
  );
}
