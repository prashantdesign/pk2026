"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { collection, query, orderBy, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { Testimonial } from '@/types';
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
import { MoreHorizontal, Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';
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
function SortableTestimonialRow({ testimonial, onDelete, onEdit }: { testimonial: Testimonial, onDelete: (id: string) => void, onEdit: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: testimonial.id });

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
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
            {testimonial.imageUrl && (
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                </div>
            )}
            <span>{testimonial.name}</span>
        </div>
      </TableCell>
      <TableCell>
        {testimonial.role}
        {testimonial.company && <span className="text-muted-foreground text-sm block">{testimonial.company}</span>}
      </TableCell>
      <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
      <TableCell>{testimonial.order}</TableCell>
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
            <DropdownMenuItem onClick={() => onEdit(testimonial.id)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(testimonial.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// Sortable Mobile Card Component
function SortableTestimonialCard({ testimonial, onDelete, onEdit }: { testimonial: Testimonial, onDelete: (id: string) => void, onEdit: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: testimonial.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card ref={setNodeRef} style={style}>
            <CardHeader className="flex flex-row items-center gap-4">
                 <Button variant="ghost" size="icon" className="cursor-grab touch-none" {...attributes} {...listeners}>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
                {testimonial.imageUrl && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                    </div>
                )}
                <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.content}</p>
                    <div className="mt-2 text-xs text-muted-foreground">Order: {testimonial.order}</div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(testimonial.id)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(testimonial.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}

export default function TestimonialsClient() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [items, setItems] = useState<Testimonial[]>([]);

  const testimonialsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'testimonials'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

  useEffect(() => {
    if (testimonials) {
      setItems(testimonials);
    }
  }, [testimonials]);

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
             const docRef = doc(firestore, 'testimonials', item.id);
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
      if (!firestore || !window.confirm("Are you sure you want to delete this testimonial?")) return;
      const docRef = doc(firestore, "testimonials", id);
      deleteDoc(docRef)
        .then(() => {
            toast({ title: "Testimonial deleted successfully." });
        })
        .catch((serverError) => {
            toast({ variant: "destructive", title: "Failed to delete testimonial." });
            const permissionError = new FirestorePermissionError({
              path: docRef.path,
              operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <Button onClick={() => router.push('/admin/testimonials/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
            </Button>
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
                        items.map((testimonial) => (
                            <SortableTestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                                onDelete={handleDelete}
                                onEdit={(id) => router.push(`/admin/testimonials/edit/${id}`)}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-12 col-span-full">
                            No testimonials found.
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
                            <TableHead>Author</TableHead>
                            <TableHead>Role/Company</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((testimonial) => (
                                    <SortableTestimonialRow
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                        onDelete={handleDelete}
                                        onEdit={(id) => router.push(`/admin/testimonials/edit/${id}`)}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No testimonials found.
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
