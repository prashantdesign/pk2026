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

const heroSchema = z.object({
  title: z.string().min(1, "Title is required."),
  subtitle: z.string().min(1, "Subtitle is required."),
  ctaText: z.string(),
  ctaLink: z.string(),
  showCta: z.boolean(),
});

const aboutSchema = z.object({
  bio: z.string().min(1, "Bio is required."),
  aboutImageUrl: z.string().url("A valid image URL is required.").optional().or(z.literal('')),
  stats: z.object({
    projects: z.coerce.number().min(0),
    experience: z.coerce.number().min(0),
  }),
  tools: z.string().transform(val => val.split(',').map(t => t.trim()).filter(Boolean)),
});

const socialsSchema = z.object({
    linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    instagram: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
});

const formSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  theme: z.enum(['light', 'dark']).default('dark'),
  socials: socialsSchema,
});

export default function SiteContentForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const firestore = useFirestore();

  const heroRef = useMemo(() => firestore ? doc(firestore, 'siteContent/hero') : null, [firestore]);
  const aboutRef = useMemo(() => firestore ? doc(firestore, 'siteContent/about') : null, [firestore]);
  const themeRef = useMemo(() => firestore ? doc(firestore, 'siteContent/theme') : null, [firestore]);
  const socialsRef = useMemo(() => firestore ? doc(firestore, 'siteContent/socials') : null, [firestore]);

  const { data: heroData, loading: heroLoading } = useDoc(heroRef);
  const { data: aboutData, loading: aboutLoading } = useDoc(aboutRef);
  const { data: themeData, loading: themeLoading } = useDoc(themeRef);
  const { data: socialsData, loading: socialsLoading } = useDoc(socialsRef);

  const isFetching = heroLoading || aboutLoading || themeLoading || socialsLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero: { title: "", subtitle: "", ctaText: "", ctaLink: "", showCta: true },
      about: { bio: "", aboutImageUrl: "", stats: { projects: 0, experience: 0 }, tools: [] },
      theme: 'dark',
      socials: { linkedin: "", twitter: "", instagram: "", email: "" },
    },
  });

  useEffect(() => {
    if (heroData) form.setValue('hero', heroData as z.infer<typeof heroSchema>);
    if (aboutData) {
        const about = aboutData as any;
        form.setValue('about.bio', about.bio);
        form.setValue('about.stats', about.stats);
        form.setValue('about.tools', about.tools.join(', '));
        if (about.aboutImageUrl) {
            form.setValue('about.aboutImageUrl', about.aboutImageUrl);
        }
    }
    if (themeData) form.setValue('theme', (themeData as any).value as 'light' | 'dark');
    if (socialsData) form.setValue('socials', socialsData as z.infer<typeof socialsSchema>);
  }, [heroData, aboutData, themeData, socialsData, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `siteContent/${Date.now()}_${file.name}`);

      try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          form.setValue('about.aboutImageUrl', downloadURL);
          toast({title: "Image uploaded successfully"});
      } catch (error) {
          toast({variant: "destructive", title: "Image upload failed"});
      } finally {
          setIsUploading(false);
      }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!firestore) return;
    setIsLoading(true);

    const operations = [
      { ref: heroRef, data: values.hero, name: 'hero' },
      { ref: aboutRef, data: {
          bio: values.about.bio,
          stats: values.about.stats,
          tools: values.about.tools,
          aboutImageUrl: values.about.aboutImageUrl || ""
      }, name: 'about' },
      { ref: themeRef, data: { value: values.theme }, name: 'theme' },
      { ref: socialsRef, data: values.socials, name: 'socials' },
    ];

    try {
        for (const op of operations) {
            if(op.ref) {
                setDoc(op.ref, op.data, { merge: true }).catch(async (serverError) => {
                    const permissionError = new FirestorePermissionError({
                      path: op.ref!.path,
                      operation: 'update',
                      requestResourceData: op.data,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                  });
            }
        }
      toast({
        title: "Content Updated",
        description: "Your website content has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your content.",
      });
    } finally {
      setIsLoading(false);
    }
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
              <FormField control={form.control} name="hero.title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="hero.subtitle" render={({ field }) => (
                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="hero.showCta" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Show CTA Button</FormLabel>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="hero.ctaText" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="hero.ctaLink" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Link</FormLabel><FormControl><Input {...field} placeholder="#work" /></FormControl><FormMessage /></FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="about">
            <AccordionTrigger className="text-xl font-semibold">About Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="about.bio" render={({ field }) => (
                <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="about.aboutImageUrl" render={({ field }) => (
                <FormItem><FormLabel>Your Picture URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div>
                <FormLabel>Or Upload Your Picture</FormLabel>
                <Input type="file" onChange={handleImageUpload} disabled={isUploading}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="about.stats.projects" render={({ field }) => (
                    <FormItem><FormLabel>Projects Completed</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="about.stats.experience" render={({ field }) => (
                    <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="about.tools" render={({ field }) => (
                <FormItem><FormLabel>Toolkit</FormLabel><FormControl><Input placeholder="Figma, Photoshop, Illustrator" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
              <FormField control={form.control} name="socials.email" render={({ field }) => (
                  <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input placeholder="your.email@example.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                  <FormItem><FormLabel>Twitter URL</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.instagram" render={({ field }) => (
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
