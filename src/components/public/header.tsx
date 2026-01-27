'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firestore = useFirestore();
  const socialsRef = useMemo(() => firestore ? doc(firestore, 'siteContent/socials') : null, [firestore]);
  const { data: socials } = useDoc(socialsRef as any);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#work', label: 'Work' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
                {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Linkedin className="h-4 w-4" /></Button></a>}
                {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Twitter className="h-4 w-4" /></Button></a>}
                {socials?.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon"><Instagram className="h-4 w-4" /></Button></a>}
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Logo />
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center gap-4 mt-4">
                    {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" size="icon"><Linkedin className="h-5 w-5" /></Button></a>}
                    {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button></a>}
                    {socials?.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" size="icon"><Instagram className="h-5 w-5" /></Button></a>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
