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
  email: z.string().email('Invalid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

const ContactSection = () => {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to database.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'contactMessages'), {
        ...values,
        timestamp: serverTimestamp(),
        isRead: false,
      });
      toast({ title: 'Message Sent!', description: "Thanks for reaching out. I'll get back to you soon." });
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get In Touch</h2>
            <p className="text-muted-foreground mt-2">Have a project in mind or just want to say hi? Send me a message.</p>
        </div>

        <div className="max-w-2xl mx-auto mt-12 animate-fade-in-up animation-delay-300">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-32" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </Form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
