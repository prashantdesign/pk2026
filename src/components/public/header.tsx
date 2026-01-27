'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
