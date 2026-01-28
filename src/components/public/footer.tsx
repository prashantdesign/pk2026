'use client';

import React from 'react';
import type { SiteContent } from '@/types';
import Logo from '../logo';
import { Button } from '../ui/button';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

interface FooterProps {
  content?: Partial<SiteContent>;
}

const SocialLink = ({ href, icon: Icon, label }: { href?: string; icon: React.ElementType; label: string }) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <Button variant="ghost" size="icon">
        <Icon className="h-5 w-5" />
      </Button>
    </a>
  );
};

const Footer: React.FC<FooterProps> = ({ content }) => {
  const socials = content?.socials;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <div className="flex gap-2">
            <SocialLink href={socials?.twitter} icon={Twitter} label="Twitter" />
            <SocialLink href={socials?.linkedin} icon={Linkedin} label="LinkedIn" />
            <SocialLink href={socials?.instagram} icon={Instagram} label="Instagram" />
            {socials?.email && (
              <a href={`mailto:${socials.email}`} aria-label="Email">
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {content?.siteName || 'PK Design'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
