import React from 'react';
import ProjectForm from '@/components/admin/project-form';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

async function getProject(projectId: string) {
  const docRef = doc(db, 'projects', projectId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  } else {
    return null;
  }
}

export default async function EditProjectPage({ params }: { params: { projectId: string } }) {
  const project = await getProject(params.projectId);

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Update the details for your project. Changes will be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
