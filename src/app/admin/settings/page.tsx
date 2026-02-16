'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Predefined color presets (HSL values)
const COLOR_PRESETS = [
  { name: 'Violet (Default)', value: '262.1 83.3% 57.8%' },
  { name: 'Blue', value: '221.2 83.2% 53.3%' },
  { name: 'Red', value: '0 84.2% 60.2%' },
  { name: 'Green', value: '142.1 76.2% 36.3%' },
  { name: 'Orange', value: '24.6 95% 53.1%' },
  { name: 'Pink', value: '333.3 71.4% 50.6%' },
];

const FONT_PRESETS = [
  { name: 'Inter (Sans)', value: 'Inter' },
  { name: 'Serif', value: 'Serif' },
  { name: 'Monospace', value: 'Mono' },
];

export default function SettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  // Fetch existing settings
  const { data: siteContent, loading } = useDoc<any>(firestore ? doc(firestore, 'siteContent', 'global') : null);

  const [primaryColor, setPrimaryColor] = useState('262.1 83.3% 57.8%');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [radius, setRadius] = useState('0.75rem');

  useEffect(() => {
    if (siteContent?.themeSettings) {
      setPrimaryColor(siteContent.themeSettings.primaryColor || '262.1 83.3% 57.8%');
      setFontFamily(siteContent.themeSettings.fontFamily || 'Inter');
      setRadius(siteContent.themeSettings.radius || '0.75rem');
    }
  }, [siteContent]);

  const handleSave = async () => {
    if (!firestore) return;

    try {
      const docRef = doc(firestore, 'siteContent', 'global');
      await setDoc(docRef, {
        themeSettings: {
          primaryColor,
          fontFamily,
          radius,
        }
      }, { merge: true });

      toast({ title: 'Theme settings updated successfully.' });

      // Force update locally for immediate feedback (though ThemeCustomizer listens to Firestore)
      // The local state update happens via the listener in ThemeCustomizer

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ variant: 'destructive', title: 'Failed to update settings.' });
    }
  };

  if (loading) {
    return <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Theme Customizer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>Customize the look and feel of your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Primary Color */}
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setPrimaryColor(preset.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${primaryColor === preset.value ? 'border-primary scale-110 ring-2 ring-offset-2 ring-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: `hsl(${preset.value})` }}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
               <Label className="text-xs text-muted-foreground w-16">Custom (HSL)</Label>
               <Input
                 value={primaryColor}
                 onChange={(e) => setPrimaryColor(e.target.value)}
                 className="font-mono text-xs"
                 placeholder="H S L"
               />
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_PRESETS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Border Radius */}
           <div className="space-y-2">
            <Label>Border Radius</Label>
            <div className="flex items-center gap-4">
                <Input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={parseFloat(radius)}
                    onChange={(e) => setRadius(`${e.target.value}rem`)}
                    className="w-full"
                />
                <span className="font-mono text-sm w-12 text-right">{radius}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="glow-primary">Save Changes</Button>
          </div>

        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
          <CardHeader>
              <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="p-6 border rounded-lg space-y-4" style={{
                  '--primary': primaryColor,
                  '--radius': radius,
                  fontFamily: fontFamily === 'Inter' ? 'var(--font-inter)' : fontFamily === 'Mono' ? 'monospace' : 'serif'
              } as React.CSSProperties}>
                  <h3 className="text-2xl font-bold">Heading Preview</h3>
                  <p>This is how your body text will look like. It respects the selected font family and primary color settings.</p>
                  <div className="flex gap-4">
                      <Button className="shadow-[0_0_10px_hsla(var(--primary)/0.5)]">Primary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
