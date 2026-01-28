'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DemoDataControls from './demo-data-controls';

export default function SettingsForm() {
  return (
    <div className="space-y-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            These actions are destructive and cannot be easily undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoDataControls />
        </CardContent>
      </Card>
    </div>
  );
}
