'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, writeBatch, getDocs } from 'firebase/firestore';
import { DEMO_PROJECTS } from '@/lib/demo-data';
import PasswordPromptDialog from './password-prompt-dialog';

export default function DemoDataControls() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'fill' | 'reset' | null>(null);
  
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleFillData = async () => {
    if (!firestore) return;
    setIsSubmitting(true);
    toast({ title: 'Populating portfolio...', description: 'Please wait.' });

    try {
      const batch = writeBatch(firestore);
      const projectsCollection = collection(firestore, 'projects');
      
      DEMO_PROJECTS.forEach(project => {
        const docRef = project.id ? collection(projectsCollection).doc(project.id) : collection(projectsCollection).doc();
        // The project type from demo data might not have createdAt/updatedAt, so we cast to any
        batch.set(docRef, project as any);
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
      const projectsCollection = collection(firestore, 'projects');
      const projectsSnapshot = await getDocs(projectsCollection);
      const batch = writeBatch(firestore);

      projectsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast({ title: 'Success!', description: 'Portfolio data has been reset.' });
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
            Populate your portfolio with sample projects. This is great for seeing how your site will look.
          </p>
          <Button variant="outline" onClick={() => openConfirmation('fill')} disabled={isSubmitting}>
            Fill with Demo Data
          </Button>
        </div>
        <div className="p-4 border rounded-lg border-destructive/50">
          <h4 className="font-semibold text-destructive">Clear All Portfolio Data</h4>
          <p className="text-sm text-muted-foreground mb-2">
            This will permanently delete all projects from your portfolio. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => openConfirmation('reset')} disabled={isSubmitting}>
            Clear Portfolio Data
          </Button>
        </div>
      </div>
    </>
  );
}
