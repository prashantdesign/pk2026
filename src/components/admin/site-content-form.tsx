"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '../ui/skeleton';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SiteContent } from '@/types';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Image from 'next/image';
import { Switch } from '../ui/switch';

const formSchema = z.object({
  siteName: z.string().optional(),
  heroTitle: z.string().min(1, "Title is required."),
  heroSubtitle: z.string().min(1, "Subtitle is required."),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  
  aboutText: z.string().min(1, "Bio is required."),
  aboutImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  
  stats: z.array(z.object({
    label: z.string().min(1, 'Label is required.'),
    value: z.string().min(1, 'Value is required.'),
  })).optional(),

  theme: z.enum(['light', 'dark']).default('dark'),

  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),

  geminiModel: z.string().optional(),
  isAiFeatureEnabled: z.boolean().default(true),
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
      siteName: "",
      heroTitle: "",
      heroSubtitle: "",
      ctaText: "",
      ctaLink: "",
      aboutText: "",
      aboutImageUrl: "",
      stats: [],
      theme: 'dark',
      linkedin: "",
      twitter: "",
      instagram: "",
      email: "",
      geminiModel: "models/gemini-1.5-flash",
      isAiFeatureEnabled: true,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  useEffect(() => {
    if (siteContent) {
      form.reset({
        siteName: siteContent.siteName || '',
        heroTitle: siteContent.heroTitle,
        heroSubtitle: siteContent.heroSubtitle,
        ctaText: siteContent.ctaText,
        ctaLink: siteContent.ctaLink,
        aboutText: siteContent.aboutText,
        aboutImageUrl: siteContent.aboutImageUrl,
        stats: siteContent.stats,
        theme: siteContent.theme || 'dark',
        linkedin: siteContent.socials?.linkedin,
        twitter: siteContent.socials?.twitter,
        instagram: siteContent.socials?.instagram,
        email: siteContent.socials?.email,
        geminiModel: siteContent.aiSettings?.geminiModel || 'models/gemini-1.5-flash',
        isAiFeatureEnabled: siteContent.aiSettings?.isAiFeatureEnabled === undefined ? true : siteContent.aiSettings.isAiFeatureEnabled,
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
          form.setValue('aboutImageUrl', downloadURL, { shouldValidate: true });
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
      siteName: values.siteName,
      heroTitle: values.heroTitle,
      heroSubtitle: values.heroSubtitle,
      ctaText: values.ctaText,
      ctaLink: values.ctaLink,
      aboutText: values.aboutText,
      aboutImageUrl: values.aboutImageUrl,
      stats: values.stats,
      theme: values.theme,
      socials: {
        linkedin: values.linkedin,
        twitter: values.twitter,
        instagram: values.instagram,
        email: values.email,
      },
      aiSettings: {
        geminiModel: values.geminiModel,
        isAiFeatureEnabled: values.isAiFeatureEnabled,
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

  const aboutImageUrl = form.watch('aboutImageUrl');

  if (isFetching) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="multiple" defaultValue={['hero', 'about', 'stats', 'theme', 'socials', 'ai']} className="w-full">
          <AccordionItem value="hero">
            <AccordionTrigger className="text-xl font-semibold">Hero Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input placeholder="PK Design" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ctaText" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ctaLink" render={({ field }) => (
                <FormItem><FormLabel>CTA Button Link</FormLabel><FormControl><Input {...field} placeholder="#work" value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
              )} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="about">
            <AccordionTrigger className="text-xl font-semibold">About Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField control={form.control} name="aboutText" render={({ field }) => (
                <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="space-y-2">
                <FormLabel>Your Picture</FormLabel>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="pt-4">
                    <FormField
                      control={form.control}
                      name="aboutImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                {aboutImageUrl && (
                  <div className="mt-4">
                    <FormLabel>Image Preview</FormLabel>
                    <div className="mt-2 relative aspect-square w-48 bg-muted rounded-md">
                      <Image src={aboutImageUrl} alt="About Me preview" fill className="rounded-md object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stats">
            <AccordionTrigger className="text-xl font-semibold">Stats Section</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormLabel>Statistics</FormLabel>
              <FormDescription>Add key metrics to display on your site.</FormDescription>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 p-2 border rounded-lg">
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`stats.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl><Input placeholder="e.g., 5+" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`stats.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl><Input placeholder="e.g., Years Experience" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', value: '' })}>
                Add Stat
              </Button>
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="ai">
            <AccordionTrigger className="text-xl font-semibold">AI Settings</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="isAiFeatureEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Enable AI Features</FormLabel>
                      <FormDescription>
                        Enable AI-powered case study generation in the project editor.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormDescription>
                The API Key must be set as an environment variable (GEMINI_API_KEY) for security reasons.
              </FormDescription>
               <FormField control={form.control} name="geminiModel" render={({ field }) => (
                  <FormItem><FormLabel>Gemini Model Name</FormLabel><FormControl><Input placeholder="models/gemini-1.5-flash" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
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
        <Button type="submit" disabled={isLoading || isUploading}>{isLoading ? 'Saving...' : 'Save Content'}</Button>
      </form>
    </Form>
  );
}
