"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { generateProjectDescription } from '@/ai/flows/generate-project-descriptions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Wand2, X } from 'lucide-react';
import type { Project } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("A valid main image URL is required"),
  projectImages: z.array(z.string().url()),
  toolsUsed: z.string(),
  order: z.coerce.number(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  outcome: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

function saveProject(firestore: any, projectId: string | undefined, data: any) {
  const projectData = { ...data, updatedAt: serverTimestamp() };
  if (projectId) {
    const projectRef = doc(firestore, 'projects', projectId);
    setDoc(projectRef, projectData, { merge: true }).catch(async (serverError: any) => {
        const permissionError = new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  } else {
    const collRef = collection(firestore, 'projects');
    const finalData = { ...projectData, createdAt: serverTimestamp() };
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

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || '',
    description: project?.description || '',
    categoryId: project?.categoryId || '',
    imageUrl: project?.imageUrl || '',
    projectImages: project?.projectImages || [],
    toolsUsed: project?.toolsUsed || '',
    order: project?.order || 0,
    problem: project?.problem || '',
    solution: project?.solution || '',
    outcome: project?.outcome || '',
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projectImages",
  });

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
      const { title, categoryId, toolsUsed } = form.getValues();
      const generated = await generateProjectDescription({
        projectTitle: title,
        category: categoryId,
        tools: toolsUsed || '',
      });
      form.setValue('description', generated.shortCaption);
      form.setValue('solution', generated.longCaseStudy);
      toast({ title: "AI descriptions generated!" });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Generation Failed" });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'imageUrl' | 'projectImages') => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);

      try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          if (fieldName === 'imageUrl') {
              form.setValue('imageUrl', downloadURL);
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

  const onSubmit = (data: ProjectFormValues) => {
    if(!firestore) {
        toast({ variant: "destructive", title: "Firestore not available" });
        return;
    }
    setIsSaving(true);
    saveProject(firestore, project?.id, data);
    toast({
      title: project ? "Project Updated" : "Project Created",
      description: "Your project has been saved successfully.",
    });
    router.push('/admin/projects');
    router.refresh();
    setIsSaving(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                <Wand2 className="mr-2 h-4 w-4" /> {isGenerating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
          </div>
          <div className="space-y-6">
             <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Branding" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="toolsUsed" render={({ field }) => (
                <FormItem><FormLabel>Tools Used</FormLabel><FormControl><Input placeholder="Figma, Photoshop" {...field} /></FormControl><FormDescription>Comma-separated values.</FormDescription><FormMessage /></FormItem>
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
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div>
                    <FormLabel>Or Upload Main Image</FormLabel>
                    <Input type="file" onChange={(e) => handleImageUpload(e, 'imageUrl')} disabled={isUploading}/>
                </div>

                <FormLabel>Additional Images</FormLabel>
                 {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <Input {...form.register(`projectImages.${index}`)} />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><X className="h-4 w-4" /></Button>
                    </div>
                 ))}
                 <div>
                    <FormLabel>Or Upload Additional Image</FormLabel>
                    <Input type="file" onChange={(e) => handleImageUpload(e, 'projectImages')} disabled={isUploading}/>
                </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="caseStudy">
            <AccordionTrigger className="text-xl font-semibold">Case Study Details</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <FormField control={form.control} name="problem" render={({ field }) => (
                    <FormItem><FormLabel>The Problem</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="solution" render={({ field }) => (
                    <FormItem><FormLabel>The Solution</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="outcome" render={({ field }) => (
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
