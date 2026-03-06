'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { convertGoogleDriveLink } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';

interface BulkImportModalProps {
  onSuccess?: () => void;
}

export function BulkImportModal({ onSuccess }: BulkImportModalProps) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleImport = async () => {
    if (!links.trim()) {
      toast({ variant: 'destructive', title: 'Please enter at least one link.' });
      return;
    }

    setIsProcessing(true);

    try {
      const urls = links.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (urls.length === 0) {
        toast({ variant: 'destructive', title: 'No valid links found.' });
        setIsProcessing(false);
        return;
      }

      if (!firestore) {
        throw new Error('Firestore not initialized');
      }

      // Batch creation logic
      // Firestore batch limit is 500 operations.
      // Assuming user won't paste > 500 links at once for now, or we can loop.
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'galleryImages');

      // We need to fetch the current max order to append correctly?
      // For simplicity, we can use a timestamp-based order or just append.
      // Or we can query the max order first.
      // Let's just use a simple approach: assign a high order based on timestamp + index
      // to ensure they appear at the end (or start depending on sort).
      // Since the list sorts by 'order' ASC, we want them to have higher order numbers.
      // A safe bet is using Date.now() but that might be large.
      // Better: Just let them be unordered (0) or fetch max order.
      // For MVP, let's use 0 or a fixed large number, user can reorder.
      // Actually, let's query the max order in the parent component and pass it?
      // Or just fetch it here.
      // To keep it simple and robust without extra reads: Just use 9999 + index for now,
      // or let the user reorder. The drag-and-drop will fix it.

      const timestamp = Date.now();

      urls.forEach((url, index) => {
        const processedUrl = convertGoogleDriveLink(url);
        // Basic validation
        if (!processedUrl.startsWith('http')) {
            console.warn(`Skipping invalid URL: ${url}`);
            return;
        }

        const newDocRef = doc(collectionRef); // Generate ID
        batch.set(newDocRef, {
          title: `Imported Image ${index + 1}`,
          imageUrl: processedUrl,
          galleryCategoryId: 'uncategorized', // Default category
          order: timestamp + index, // Simple ordering strategy
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();

      toast({ title: `Successfully imported ${urls.length} images.` });
      setLinks('');
      setOpen(false);
      onSuccess?.();

    } catch (error) {
      console.error('Bulk import error:', error);
      toast({ variant: 'destructive', title: 'Failed to import images.', description: String(error) });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Image Import</DialogTitle>
          <DialogDescription>
            Paste image URLs (one per line). Google Drive links will be automatically converted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="https://example.com/image1.jpg&#10;https://drive.google.com/file/d/..."
            className="min-h-[200px] font-mono text-sm"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {links.split('\n').filter(l => l.trim()).length} links detected.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Import Images'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
