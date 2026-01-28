'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import type { SiteContent } from '@/types';

interface FooterProps {
  content: SiteContent | null;
}

const SocialIcon = ({ name, url }: { name: string; url: string }) => {
  const icons: { [key: string]: React.ElementType } = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    email: Mail,
  };
  const Icon = icons[name];
  const isEmail = name === 'email';
  
  if (!Icon) return null;

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href={isEmail ? `mailto:${url}` : url} target="_blank" rel="noopener noreferrer">
        <Icon className="h-5 w-5" />
      </Link>
    </Button>
  );
};


export default function Footer({ content }: FooterProps) {
  const socials = content?.socials || {};
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo />
            <div className="flex items-center gap-2">
                {socials.linkedin && <SocialIcon name="linkedin" url={socials.linkedin} />}
                {socials.twitter && <SocialIcon name="twitter" url={socials.twitter} />}
                {socials.instagram && <SocialIcon name="instagram" url={socials.instagram} />}
                {socials.email && <SocialIcon name="email" url={socials.email} />}
            </div>
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} PK.Design. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
