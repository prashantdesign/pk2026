'use client';

import React, { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const initialState = {
  message: '',
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export default function ContactSection() {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? 'Oops!' : 'Success!',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
      if (!state.error) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <Card className="max-w-xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Get in Touch</CardTitle>
            <CardDescription>
              Have a project in mind or just want to say hi? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
