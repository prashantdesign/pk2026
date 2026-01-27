import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to PK Design Studio Admin</CardTitle>
          <CardDescription>
            This is your control center. Manage your portfolio content, projects, and messages from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Use the sidebar on the left to navigate through the different sections. Any changes you save will be reflected on your live website instantly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
