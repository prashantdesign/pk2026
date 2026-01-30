'use server';

import { z } from 'zod';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  message: z.string().min(1, { message: 'Message is required.' }),
});

export type FormState = {
  message: string;
  error?: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.errors.map((e) => e.message).join(', '),
      error: true,
    };
  }

  const { name, email, message } = parsed.data;

  try {
    // Initialize Firebase Admin SDK if not already done
    if (!getApps().length) {
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    const firestore = getFirestore();
    
    await firestore.collection('contactMessages').add({
      name,
      email,
      message,
      isRead: false,
      timestamp: FieldValue.serverTimestamp(),
    });
    
    return { message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { message: 'Something went wrong. Please try again later.', error: true };
  }
}
