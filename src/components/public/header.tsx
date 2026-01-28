'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { Menu, X } from 'lucide-react';
import { SiteContent } from '@/types';

interface HeaderProps {
    siteName?: string;
}

const Header: React.FC<HeaderProps> = ({ siteName }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
