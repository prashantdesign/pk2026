"use client";

import React, { useMemo } from 'react';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
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
import { MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

export default function TestimonialsClient() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const testimonialsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'testimonials'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);

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

        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {testimonials && testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
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
                                    <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/edit/${testimonial.id}`)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(testimonial.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
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
                    {testimonials && testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                            <TableRow key={testimonial.id}>
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
                                    <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/edit/${testimonial.id}`)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(testimonial.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
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
    </>
  );
}
