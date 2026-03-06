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
import { convertGoogleDriveLink } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkProjectImagesModalProps {
  onImport: (urls: string[]) => void;
}

export function BulkProjectImagesModal({ onImport }: BulkProjectImagesModalProps) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState('');
  const { toast } = useToast();

  const handleImport = () => {
    if (!links.trim()) {
      toast({ variant: 'destructive', title: 'Please enter at least one link.' });
      return;
    }

    const urls = links.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(url => convertGoogleDriveLink(url));

    if (urls.length === 0) {
      toast({ variant: 'destructive', title: 'No valid links found.' });
      return;
    }

    onImport(urls);
    toast({ title: `Added ${urls.length} images.` });
    setLinks('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Bulk Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Add Project Images</DialogTitle>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>
            Add Images
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
