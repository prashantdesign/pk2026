"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '../ui/skeleton';

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

const formSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
});

export default function SiteContentForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero: { title: "", subtitle: "", ctaText: "", ctaLink: "", showCta: true },
      about: { bio: "", aboutImageUrl: "", stats: { projects: 0, experience: 0 }, tools: [] },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "siteContent", "hero"));
        const aboutDoc = await getDoc(doc(db, "siteContent", "about"));

        if (heroDoc.exists()) {
          form.setValue('hero', heroDoc.data() as z.infer<typeof heroSchema>);
        }
        if (aboutDoc.exists()) {
          const aboutData = aboutDoc.data()
          form.setValue('about.bio', aboutData.bio);
          form.setValue('about.stats', aboutData.stats);
          form.setValue('about.tools', aboutData.tools.join(', '));
          if (aboutData.aboutImageUrl) {
            form.setValue('about.aboutImageUrl', aboutData.aboutImageUrl);
          }
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error fetching content." });
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [form, toast]);

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
    setIsLoading(true);
    try {
      await setDoc(doc(db, "siteContent", "hero"), values.hero);
      await setDoc(doc(db, "siteContent", "about"), {
          bio: values.about.bio,
          stats: values.about.stats,
          tools: values.about.tools,
          aboutImageUrl: values.about.aboutImageUrl || ""
      });

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
        <Accordion type="multiple" defaultValue={['hero', 'about']} className="w-full">
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
        </Accordion>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Content'}</Button>
      </form>
    </Form>
  );
}
