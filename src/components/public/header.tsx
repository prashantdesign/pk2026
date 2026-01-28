'use client';
import React from 'react';
import Logo from '@/components/logo';

interface HeaderProps {
  siteName?: string | null;
}

export default function Header({ siteName }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex gap-6 items-center">
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#work" className="text-sm font-medium hover:text-primary transition-colors">Work</a>
            <a href="#gallery" className="text-sm font-medium hover:text-primary transition-colors">Gallery</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}
