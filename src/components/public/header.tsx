'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        hasScrolled ? 'py-4 bg-background/80 backdrop-blur-lg border-b border-border' : 'py-6'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button variant="link" className="text-foreground/80 hover:text-foreground text-sm font-medium">
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-background/95 backdrop-blur-lg">
            <nav className="flex flex-col items-center gap-4 py-4">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-foreground text-lg" onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                </Button>
                </Link>
            ))}
            </nav>
        </div>
      )}
    </header>
  );
}
