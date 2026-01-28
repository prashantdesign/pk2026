'use client';
import React from 'react';
import Link from 'next/link';
import Logo from '@/components/logo';

interface HeaderProps {
  siteName?: string;
}

const Header: React.FC<HeaderProps> = ({ siteName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" aria-label={siteName || 'Homepage'}>
          <Logo />
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li><a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a></li>
            <li><a href="#work" className="text-sm font-medium hover:text-primary transition-colors">Work</a></li>
            <li><a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
