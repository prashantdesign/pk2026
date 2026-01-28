'use client';

import React from 'react';
import type { SiteContent } from '@/types';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import Logo from '@/components/logo';

interface FooterProps {
  content?: Partial<SiteContent>;
}

const SocialLink = ({ href, icon: Icon, label }: { href?: string; icon: React.ElementType; label: string }) => {
    if (!href) return null;
    return (
        <a href={href.startsWith('mailto:') ? href : `https://${href.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground hover:text-primary transition-colors">
            <Icon className="h-5 w-5" />
        </a>
    );
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  return (
    <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <Logo />
                <div className="flex items-center gap-4">
                    <SocialLink href={content?.socials?.twitter} icon={Twitter} label="Twitter" />
                    <SocialLink href={content?.socials?.linkedin} icon={Linkedin} label="LinkedIn" />
                    <SocialLink href={content?.socials?.instagram} icon={Instagram} label="Instagram" />
                    <SocialLink href={content?.socials?.email ? `mailto:${content.socials.email}`: undefined} icon={Mail} label="Email" />
                </div>
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {content?.siteName || "PK Design"}. All rights reserved.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
