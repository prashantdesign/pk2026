"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { saveProject } from '@/app/admin/actions';
import { generateProjectDescription } from '@/ai/flows/generate-project-descriptions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Wand2, X } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  category: z.string().min(1, "Category is required"),
  mainImageUrl: z.string().url("A valid main image URL is required"),
  images: z.array(z.string().url()),
  tags: z.string().transform(val => val.split(',').map(t => t.trim()).filter(Boolean)),
  order: z.coerce.number(),
  caseStudy: z.object({
    problem: z.string(),
    solution: z.string(),
    tools: z.string(),
    outcome: z.string(),
  }).optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || '',
    shortDescription: project?.shortDescription || '',
    category: project?.category || '',
    mainImageUrl: project?.mainImageUrl || '',
    images: project?.images || [],
    tags: project?.tags?.join(', ') || '',
    order: project?.order || 0,
    caseStudy: project?.caseStudy || { problem: '', solution: '', tools: '', outcome: '' },
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
      const { title, category, caseStudy } = form.getValues();
      const generated = await generateProjectDescription({
        projectTitle: title,
        category: category,
        tools: caseStudy?.tools || '',
      });
      form.setValue('shortDescription', generated.shortCaption);
      if (form.getValues('caseStudy')) {
          form.setValue('caseStudy.solution', generated.longCaseStudy);
      }
      toast({ title: "AI descriptions generated!" });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Generation Failed" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'mainImageUrl' | 'images') => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);

      try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          if (fieldName === 'mainImageUrl') {
              form.setValue('mainImageUrl', downloadURL);
          } else {
              append(downloadURL);
          }
          toast({title: "Image uploaded successfully"});
      } catch (error) {
          toast({variant: "destructive", title: "Image upload failed"});
      } finally {
          setIsUploading(false);
      }
  }

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSaving(true);
    try {
      await saveProject(project?.id, data);
      toast({
        title: project ? "Project Updated" : "Project Created",
        description: "Your project has been saved successfully.",
      });
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your project.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                <Wand2 className="mr-2 h-4 w-4" /> {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
          </div>
          <div className="space-y-6">
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Branding" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="Logo, UI, UX" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['images', 'caseStudy']} className="w-full">
          <AccordionItem value="images">
            <AccordionTrigger className="text-xl font-semibold">Project Images</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <FormField control={form.control} name="mainImageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div>
                    <FormLabel>Or Upload Main Image</FormLabel>
                    <Input type="file" onChange={(e) => handleImageUpload(e, 'mainImageUrl')} disabled={isUploading}/>
                </div>

                <FormLabel>Additional Images</FormLabel>
                 {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <Input {...form.register(`images.${index}`)} />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><X className="h-4 w-4" /></Button>
                    </div>
                 ))}
                 <div>
                    <FormLabel>Or Upload Additional Image</FormLabel>
                    <Input type="file" onChange={(e) => handleImageUpload(e, 'images')} disabled={isUploading}/>
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="caseStudy">
            <AccordionTrigger className="text-xl font-semibold">Case Study Details</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <FormField control={form.control} name="caseStudy.problem" render={({ field }) => (
                    <FormItem><FormLabel>The Problem</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.solution" render={({ field }) => (
                    <FormItem><FormLabel>The Solution</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.tools" render={({ field }) => (
                    <FormItem><FormLabel>Tools Used</FormLabel><FormControl><Input placeholder="Figma, Photoshop" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="caseStudy.outcome" render={({ field }) => (
                    <FormItem><FormLabel>Outcome</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Project'}
        </Button>
      </form>
    </Form>
  );
}
