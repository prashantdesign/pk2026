'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(1, 'Message is required.'),
});

export default function ContactSection() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '', message: '' },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the server.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'contactMessages'), {
                ...values,
                timestamp: serverTimestamp(),
                isRead: false,
            });
            toast({ title: 'Message Sent!', description: 'Thanks for reaching out. I will get back to you soon.' });
            form.reset();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <section id="contact" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get In Touch</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Have a project in mind or just want to say hello? Drop me a line.</p>
      </div>
      <div className="max-w-xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-32" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="text-center">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
            </form>
        </Form>
      </div>
    </section>
  );
}
