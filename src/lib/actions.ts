'use server';

import { z } from 'zod';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getSdks } from '@/firebase/index.server';
import { sendMail } from '@/lib/mail';
import type { SiteContent } from '@/types';

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
    const { firestore } = getSdks();
    
    // 1. Save message to Firestore
    const messageRef = await addDoc(collection(firestore, 'contactMessages'), {
      name,
      email,
      message,
      isRead: false,
      timestamp: serverTimestamp(),
    });

    // 2. Fetch admin email and send notification
    const siteContentRef = doc(firestore, 'siteContent', 'global');
    const siteContentSnap = await getDoc(siteContentRef);

    if (siteContentSnap.exists()) {
      const siteContent = siteContentSnap.data() as SiteContent;
      const adminEmail = siteContent.adminEmail;

      if (adminEmail) {
        await sendMail({
          to: adminEmail,
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
              <h2 style="color: #333;">New Message from your Portfolio Contact Form</h2>
              <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; border-left: 3px solid #ccc; padding-left: 15px;">${message}</p>
              </div>
            </div>
          `,
        });
      }
    }
    
    return { message: 'Thank you for your message! I will get back to you soon.' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { message: 'Something went wrong. Please try again later.', error: true };
  }
}
