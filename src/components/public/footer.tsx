'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from '@/components/logo';

interface FooterProps {
    content?: SiteContent | null;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Logo />
                 <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {content?.siteName || "PK.Design"}. All Rights Reserved.</p>
                <div className="flex gap-4 items-center">
                    {content?.socials?.twitter && <a href={content.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>}
                    {content?.socials?.linkedin && <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>}
                    {content?.socials?.instagram && <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>}
                    {content?.socials?.email && <a href={`mailto:${content.socials.email}`} className="text-muted-foreground hover:text-primary"><Mail size={20} /></a>}
                </div>
            </div>
        </div>
    </footer>
  );
}
