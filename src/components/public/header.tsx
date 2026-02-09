'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { useActiveSection } from '@/hooks/use-active-section';
import { cn } from '@/lib/utils';

const Header = ({ siteName }: { siteName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Gallery', href: '#gallery', id: 'gallery' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const activeSection = useActiveSection(navItems.map(item => item.id));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b border-transparent",
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-border/10' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center">
          <Logo text={siteName} />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors relative py-2",
                activeSection === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300" />
              )}
            </a>
          ))}
          <ModeToggle />
        </nav>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col items-center gap-6 bg-background p-8 min-h-screen">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                    "text-2xl font-medium transition-colors",
                    activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-8">
                <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
