"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { collection, query, orderBy, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { GalleryImage } from '@/types';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, GripVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { BulkImportModal } from '@/components/admin/bulk-import-modal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Component
function SortableGalleryRow({ image, onDelete, onEdit }: { image: GalleryImage, onDelete: (id: string) => void, onEdit: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
       <TableCell className="w-[50px]">
        <Button variant="ghost" size="icon" className="cursor-grab touch-none" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </TableCell>
      <TableCell>
        <Image
            src={image.imageUrl}
            alt={image.title}
            width={80}
            height={80}
            className="rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{image.title}</TableCell>
      <TableCell>{image.order}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(image.id)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(image.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Sortable Mobile Card Component
function SortableGalleryCard({ image, onDelete, onEdit }: { image: GalleryImage, onDelete: (id: string) => void, onEdit: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-card rounded-lg border shadow-sm flex flex-col">
            <div className="flex items-center p-2 bg-muted/20 border-b">
                 <Button variant="ghost" size="icon" className="cursor-grab touch-none mr-2" {...attributes} {...listeners}>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
                 <span className="text-sm font-medium">Drag to reorder</span>
            </div>
             <div className="relative aspect-video w-full">
                <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                />
             </div>
            <div className="p-4">
                 <h3 className="font-medium">{image.title}</h3>
                 <p className="text-sm text-muted-foreground">Order: {image.order}</p>
            </div>
            <div className="p-4 pt-0 flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(image.id)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(image.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default function GalleryClient() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [items, setItems] = useState<GalleryImage[]>([]);

  const galleryQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryImages'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: images, loading, refresh } = useCollection<GalleryImage>(galleryQuery);

  useEffect(() => {
    if (images) {
      setItems(images);
    }
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Update order in Firestore
      if (firestore) {
         const oldIndex = items.findIndex((item) => item.id === active.id);
         const newIndex = items.findIndex((item) => item.id === over.id);
         const newItems = arrayMove(items, oldIndex, newIndex);

         const batch = writeBatch(firestore);
         newItems.forEach((item, index) => {
             const docRef = doc(firestore, 'galleryImages', item.id);
             batch.update(docRef, { order: index });
         });

         try {
             await batch.commit();
             toast({ title: "Order updated successfully." });
         } catch (error) {
             console.error("Error updating order:", error);
             toast({ variant: "destructive", title: "Failed to update order." });
         }
      }
    }
  };

  const handleDelete = (id: string) => {
      if (!firestore || !window.confirm("Are you sure you want to delete this image?")) return;
      const imageRef = doc(firestore, "galleryImages", id);
      deleteDoc(imageRef)
        .then(() => {
            toast({ title: "Image deleted successfully." });
        })
        .catch((serverError) => {
            toast({ variant: "destructive", title: "Failed to delete image." });
            const permissionError = new FirestorePermissionError({
              path: imageRef.path,
              operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
            <div className="flex gap-2">
                <BulkImportModal onSuccess={() => {
                    toast({ title: 'Images imported successfully.' });
                    refresh?.(); // Optional if real-time listener updates automatically
                }} />
                <Button onClick={() => router.push('/admin/gallery/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Image
                </Button>
            </div>
        </div>

        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                {/* Mobile View */}
                <div className="grid gap-4 md:hidden">
                    {items.length > 0 ? (
                        items.map((image) => (
                            <SortableGalleryCard
                                key={image.id}
                                image={image}
                                onDelete={handleDelete}
                                onEdit={(id) => router.push(`/admin/gallery/edit/${id}`)}
                            />
                        ))
                    ) : (
                         <div className="text-center text-muted-foreground py-12 col-span-full">
                            No images found in gallery.
                        </div>
                    )}
                </div>

                {/* Desktop View */}
                <Card className="hidden md:block">
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((image) => (
                                    <SortableGalleryRow
                                        key={image.id}
                                        image={image}
                                        onDelete={handleDelete}
                                        onEdit={(id) => router.push(`/admin/gallery/edit/${id}`)}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No images found in gallery.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </SortableContext>
        </DndContext>
    </>
  );
}
