import React from 'react';
import Logo from '../logo';
import { Button } from '../ui/button';
import Link from 'next/link';

// You can add your actual social links here
const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'GitHub', href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
        <div className="flex gap-2">
            {socialLinks.map(link => (
                <Button key={link.name} variant="ghost" asChild>
                    <Link href={link.href}>{link.name}</Link>
                </Button>
            ))}
        </div>
        <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PK Design Studio. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
