import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteContent } from '@/types';
import { Card, CardContent } from '../ui/card';
import { Briefcase, Users, Award } from 'lucide-react';
import { Icons } from '../icons';

async function getAboutContent() {
    const docRef = doc(db, 'siteContent', 'about');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as SiteContent['about'];
    }
    return {
        bio: 'I am a passionate designer with a love for creating intuitive and beautiful user experiences. With a background in both graphic design and front-end development, I bridge the gap between aesthetics and functionality.',
        stats: {
            projects: 50,
            experience: 5,
            clients: 20
        },
        tools: ['Figma', 'Photoshop', 'Illustrator', 'Spline']
    }
}


export default async function AboutSection() {
    const content = await getAboutContent();
    
    const stats = [
        { icon: <Briefcase/>, value: content.stats.projects, label: 'Projects Completed' },
        { icon: <Award/>, value: content.stats.experience, label: 'Years of Experience' },
        { icon: <Users/>, value: content.stats.clients, label: 'Happy Clients' },
    ]

  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">About Me</h2>
                <p className="mt-4 text-lg text-foreground/80">
                    {content.bio}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-secondary/50 border-secondary">
                            <CardContent className="p-4 text-center">
                                <div className="text-primary mx-auto h-8 w-8 mb-2">{stat.icon}</div>
                                <p className="text-3xl font-bold">{stat.value}+</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold tracking-tight text-center md:text-left mb-6">My Toolkit</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {content.tools && content.tools.length > 0 ? (
                        content.tools.map((tool) => (
                            <div key={tool} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300">
                                <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                                    <Icons name={tool} className="w-8 h-8" />
                                </div>
                                <span className="text-sm font-medium">{tool}</span>
                            </div>
                        ))
                    ) : (
                        <p>No tools listed.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
