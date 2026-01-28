'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = (values: ContactFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
      return;
    }
    setIsLoading(true);
    const messagesCol = collection(firestore, 'contactMessages');
    const data = {
        ...values,
        timestamp: serverTimestamp(),
        isRead: false,
      };

    addDoc(messagesCol, data)
    .then(() => {
        toast({ title: 'Message Sent!', description: "Thanks for reaching out. I'll get back to you soon." });
        form.reset();
    })
    .catch(async (serverError) => {
        toast({ variant: 'destructive', title: 'Error', description: 'There was a problem sending your message.' });
        const permissionError = new FirestorePermissionError({
            path: messagesCol.path,
            operation: 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
    })
    .finally(() => {
        setIsLoading(false);
    });
  };

  return (
    <section id="contact" className="py-20 lg:py-32 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h2>
            <p className="mt-4 text-muted-foreground">Have a project in mind? Let's talk.</p>
        </div>

        <div className="max-w-xl mx-auto mt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Tell me about your project..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
