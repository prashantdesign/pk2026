'use client';

import React, { useMemo } from 'react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function Footer() {
  const firestore = useFirestore();
  const socialsRef = useMemo(() => firestore ? doc(firestore, 'siteContent/socials') : null, [firestore]);
  const { data: socials } = useDoc(socialsRef as any);
  
  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-6">
        <Logo />
        <div className="flex items-center gap-4">
            {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Linkedin className="h-5 w-5" /></Button></a>}
            {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button></a>}
            {socials?.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Instagram className="h-5 w-5" /></Button></a>}
            {socials?.email && <a href={`mailto:${socials.email}`}><Button variant="ghost" size="icon"><Mail className="h-5 w-5" /></Button></a>}
        </div>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PK Design. All rights reserved.</p>
      </div>
    </footer>
  );
}
