'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveMessage } from '@/app/admin/actions';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const ContactSection = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await saveMessage(values);
    if (result.success) {
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error || 'There was a problem sending your message.',
      });
    }
    setIsLoading(false);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-xl">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">Get In Touch</CardTitle>
                    <CardDescription>Have a project in mind? I&apos;d love to hear from you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <Input placeholder="Your Name" {...form.register('name')} />
                      {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                      <Input placeholder="Your Email" {...form.register('email')} />
                      {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                      <Textarea placeholder="Your Message" {...form.register('message')} rows={5} />
                      {form.formState.errors.message && <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
