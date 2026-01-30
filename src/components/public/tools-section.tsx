"use client";

import React from 'react';
import type { SiteContent } from '@/types';
import SectionHeader from './section-header';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

interface ToolsSectionProps {
    content?: SiteContent | null;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ content }) => {
    if (!content?.tools || content.tools.length === 0) {
        return null;
    }

    return (
        <section id="tools" className="py-20 lg:py-32 bg-secondary/50">
            <div className="container mx-auto px-4">
                 <SectionHeader 
                    title={content.toolsSectionTitle}
                    description={content.toolsSectionDescription}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 animate-fade-in-up animation-delay-300">
                    {content.tools.map((tool, index) => (
                        <div key={index} className="flex flex-col items-center justify-center text-center gap-2">
                            <Card className="p-4 w-24 h-24 flex items-center justify-center">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={tool.iconUrl}
                                        alt={`${tool.name} icon`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Card>
                            <p className="font-semibold">{tool.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ToolsSection;

    