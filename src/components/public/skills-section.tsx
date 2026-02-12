"use client";

import React from 'react';
import type { SiteContent } from '@/types';
import SectionHeader from './section-header';
import { Badge } from '../ui/badge';
import { StaggerContainer, staggerItem } from '@/components/animations/stagger-container';
import { motion } from 'framer-motion';

interface SkillsSectionProps {
    content?: SiteContent | null;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ content }) => {
    if (!content?.skills || content.skills.length === 0) {
        return null;
    }

    return (
        <section id="skills" className="py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionHeader 
                    title={content.skillsSectionTitle}
                    description={content.skillsSectionDescription}
                />
                 <StaggerContainer className="flex flex-wrap justify-center gap-4">
                    {content.skills.map((skill, index) => (
                        <motion.div key={index} variants={staggerItem} whileHover={{ scale: 1.1, rotate: 3 }}>
                            <Badge variant="secondary" className="text-lg px-6 py-3 rounded-full cursor-default shadow-sm hover:shadow-md transition-shadow bg-secondary/80 backdrop-blur-sm border border-border/50">
                               {skill}
                            </Badge>
                        </motion.div>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}

export default SkillsSection;

    