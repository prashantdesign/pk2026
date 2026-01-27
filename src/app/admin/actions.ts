"use server";

import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function saveProject(projectId: string | undefined, data: any) {
  try {
    if (projectId) {
      // Update existing project
      const projectRef = doc(db, 'projects', projectId);
      await setDoc(projectRef, data, { merge: true });
    } else {
      // Create new project
      await addDoc(collection(db, 'projects'), data);
    }
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error: "Failed to save project." };
  }
}
