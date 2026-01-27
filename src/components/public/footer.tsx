'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Logo from '@/components/logo';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Socials {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  email?: string;
}

const Footer = () => {
  const [socials, setSocials] = useState<Socials>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'socials');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocials(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="bg-muted/40 text-muted-foreground border-t">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-6">
        <Logo />
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {loading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          ) : (
            <>
              {socials.email && (
                <a href={`mailto:${socials.email}`} className="text-sm hover:text-primary transition-colors">
                  {socials.email}
                </a>
              )}
              <div className="flex items-center space-x-4">
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-muted/80 py-2 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} PK Design Studio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
