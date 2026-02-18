"use client";

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit, getDocs, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { convertGoogleDriveLink } from '@/lib/utils';
import type { GalleryCategory } from '@/types';

export function GalleryBulkImport() {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const categoriesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryCategories'), orderBy('name'));
  }, [firestore]);

  const { data: categories, isLoading: categoriesLoading } = useCollection<GalleryCategory>(categoriesQuery);

  // Set default category to "Ecommerce" if available, or the first one
  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      const ecommerceCategory = categories.find(c => c.name.toLowerCase() === 'ecommerce');
      if (ecommerceCategory) {
        setSelectedCategory(ecommerceCategory.id);
      } else {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories, selectedCategory]);

  const handleImport = async () => {
    if (!firestore) return;
    if (!urls.trim()) {
      toast({ variant: "destructive", title: "No URLs provided" });
      return;
    }
    if (!selectedCategory) {
      toast({ variant: "destructive", title: "Please select a category" });
      return;
    }

    setIsImporting(true);

    try {
      // 1. Process URLs
      const urlList = urls.split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0)
        .map(url => convertGoogleDriveLink(url));

      if (urlList.length === 0) {
        toast({ variant: "destructive", title: "No valid URLs found" });
        setIsImporting(false);
        return;
      }

      // 2. Get current highest order
      const q = query(collection(firestore, 'galleryImages'), orderBy('order', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let currentOrder = 0;
      if (!querySnapshot.empty) {
        currentOrder = querySnapshot.docs[0].data().order || 0;
      }

      // 3. Create batch (max 500 ops, likely fine here)
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'galleryImages');

      urlList.forEach((url, index) => {
        const newDocRef = doc(collectionRef); // Generate ID automatically
        batch.set(newDocRef, {
          title: "", // As requested
          imageUrl: url,
          galleryCategoryId: selectedCategory,
          order: currentOrder + index + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();

      toast({
        title: "Import Successful",
        description: `Successfully imported ${urlList.length} images.`,
      });

      setUrls('');
      setOpen(false);
      // Wait a bit to ensure UI refresh if needed, though Firestore listener should handle it
    } catch (error: any) {
      console.error("Bulk Import Error:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "An error occurred during import.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Gallery Images</DialogTitle>
          <DialogDescription>
            Paste a list of image URLs (one per line). Google Drive links are supported.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
                <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    disabled={categoriesLoading || isImporting}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="urls">Image URLs</Label>
            <Textarea
              id="urls"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="min-h-[200px] font-mono text-sm"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={isImporting}
            />
             <p className="text-xs text-muted-foreground">
              {urls.split('\n').filter(u => u.trim()).length} images detected.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleImport} disabled={isImporting || categoriesLoading}>
            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Images
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
