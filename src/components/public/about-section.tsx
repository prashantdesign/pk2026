"use client";

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import type { SiteContent } from '@/types';

type AboutContent = SiteContent['about'];

const StatCard = ({ value, label, loading }: { value: number; label: string, loading: boolean }) => (
    <div className="bg-card p-6 rounded-lg text-center shadow-sm">
        {loading ? <Skeleton className="h-8 w-16 mx-auto mb-2" /> : <div className="text-4xl font-bold text-primary">{value}+</div>}
        {loading ? <Skeleton className="h-4 w-24 mx-auto" /> : <p className="text-muted-foreground">{label}</p>}
    </div>
);

export default function AboutSection() {
    const [content, setContent] = useState<AboutContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, 'siteContent', 'about');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data() as AboutContent);
                }
            } catch (error) {
                console.error("Failed to fetch about content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <section id="about" className="py-20 md:py-32 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">About Me</h2>
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                    {content?.bio}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard loading={loading} value={content?.stats?.projects ?? 0} label="Projects" />
                            <StatCard loading={loading} value={content?.stats?.experience ?? 0} label="Years" />
                            <StatCard loading={loading} value={content?.stats?.clients ?? 0} label="Clients" />
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-bold mb-8 text-foreground">My Toolkit</h3>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-16" />)
                            ) : (
                                (content?.tools || []).map((tool) => (
                                    <div key={tool} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                        <Icons name={tool} className="w-12 h-12" />
                                        <span className="text-sm font-medium">{tool}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
