import React from 'react';
import SettingsForm from '@/components/admin/settings-form';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
      <SettingsForm />
    </div>
  );
}
