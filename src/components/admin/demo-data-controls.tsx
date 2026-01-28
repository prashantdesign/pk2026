'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, writeBatch, getDocs, doc, addDoc } from 'firebase/firestore';
import { DEMO_PROJECT_CATEGORIES, DEMO_PROJECTS_RAW } from '@/lib/demo-data';
import PasswordPromptDialog from './password-prompt-dialog';
import type { ProjectCategory } from '@/types';

export default function DemoDataControls() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'fill' | 'reset' | null>(null);
  
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleFillData = async () => {
    if (!firestore) return;
    setIsSubmitting(true);
    toast({ title: 'Populating portfolio...', description: 'Please wait.' });

    try {
      const batch = writeBatch(firestore);
      
      // 1. Create Categories and get their IDs
      const categoryPromises = DEMO_PROJECT_CATEGORIES.map(category => {
        const docRef = doc(collection(firestore, 'projectCategories'));
        batch.set(docRef, category);
        return { ...category, id: docRef.id };
      });
      const createdCategories = categoryPromises;
      
      // 2. Create a map of category names to IDs
      const categoryNameIdMap = createdCategories.reduce((acc, cat) => {
        acc[cat.name] = cat.id;
        return acc;
      }, {} as Record<string, string>);

      // 3. Create Projects with correct category IDs
      DEMO_PROJECTS_RAW.forEach(project => {
        const { categoryName, ...projectData } = project;
        const projectCategoryId = categoryNameIdMap[categoryName];
        if (projectCategoryId) {
          const docRef = doc(collection(firestore, 'projects'));
          batch.set(docRef, { ...projectData, projectCategoryId });
        }
      });

      await batch.commit();
      toast({ title: 'Success!', description: 'Portfolio has been populated with demo data.' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not populate portfolio.' });
    } finally {
      setIsSubmitting(false);
      setDialogOpen(false);
    }
  };

  const handleResetData = async () => {
    if (!firestore) return;
    setIsSubmitting(true);
    toast({ title: 'Resetting portfolio...', description: 'This may take a moment.' });
    
    try {
      const collectionsToClear = ['projects', 'projectCategories', 'galleryImages', 'galleryCategories'];
      const batch = writeBatch(firestore);

      for (const coll of collectionsToClear) {
        const snapshot = await getDocs(collection(firestore, coll));
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
      toast({ title: 'Success!', description: 'All portfolio data has been reset.' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not reset portfolio data.' });
    } finally {
      setIsSubmitting(false);
      setDialogOpen(false);
    }
  };
  
  const onConfirm = () => {
    if (actionToConfirm === 'fill') {
      handleFillData();
    } else if (actionToConfirm === 'reset') {
      handleResetData();
    }
  };

  const openConfirmation = (action: 'fill' | 'reset') => {
    setActionToConfirm(action);
    setDialogOpen(true);
  };

  return (
    <>
      <PasswordPromptDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={onConfirm}
        isSubmitting={isSubmitting}
        action={actionToConfirm}
      />
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">Fill with Demo Data</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Populate your portfolio with sample projects and categories. This is great for seeing how your site will look.
          </p>
          <Button variant="outline" onClick={() => openConfirmation('fill')} disabled={isSubmitting}>
            Fill with Demo Data
          </Button>
        </div>
        <div className="p-4 border rounded-lg border-destructive/50">
          <h4 className="font-semibold text-destructive">Clear All Portfolio Data</h4>
          <p className="text-sm text-muted-foreground mb-2">
            This will permanently delete all projects, galleries, and categories. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => openConfirmation('reset')} disabled={isSubmitting}>
            Clear Portfolio Data
          </Button>
        </div>
      </div>
    </>
  );
}
