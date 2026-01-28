'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteContent } from '@/types';
import Logo from '@/components/logo';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    const firestore = useFirestore();
    const siteContentRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'siteContent', 'global');
    }, [firestore]);
    const { data: siteContent } = useDoc<SiteContent>(siteContentRef);
    
    const socials = [
        { name: 'LinkedIn', href: siteContent?.socials?.linkedin, icon: Linkedin },
        { name: 'Twitter', href: siteContent?.socials?.twitter, icon: Twitter },
        { name: 'Instagram', href: siteContent?.socials?.instagram, icon: Instagram },
        { name: 'Email', href: siteContent?.socials?.email ? `mailto:${siteContent.socials.email}`: undefined, icon: Mail },
    ];

    return (
        <footer className="bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <Logo />
                    <div className="flex gap-6">
                        {socials.map((item) => (
                           item.href && (
                            <Link key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <item.icon className="h-6 w-6" />
                                <span className="sr-only">{item.name}</span>
                            </Link>
                           )
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} PK.Design. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
