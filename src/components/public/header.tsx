'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useUser } from '@/firebase';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const { theme } = useTheme();

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? (theme === 'dark' ? 'bg-background/80 backdrop-blur-sm' : 'bg-background/80 backdrop-blur-sm') : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            {user && (
              <Button asChild variant="ghost">
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center gap-4 py-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
             {user && (
              <Button asChild variant="ghost">
                <Link href="/admin">Admin</Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
