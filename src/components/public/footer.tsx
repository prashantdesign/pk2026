'use client';
import React from 'react';
import type { SiteContent } from '@/types';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from '../logo';

const Footer = ({ content }: { content: SiteContent | null }) => {
  const socialLinks = content?.socials;

  const hasSocials = socialLinks && (socialLinks.linkedin || socialLinks.twitter || socialLinks.instagram || socialLinks.email);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        {hasSocials && (
            <div className="flex items-center gap-4">
            {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin /></a>}
            {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter /></a>}
            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram /></a>}
            {socialLinks?.email && <a href={`mailto:${socialLinks.email}`} aria-label="Email" className="text-muted-foreground hover:text-primary"><Mail /></a>}
            </div>
        )}
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {content?.siteName || 'PK Design'}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
