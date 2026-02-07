"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Project, SiteContent } from '@/types';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import LoadingLogo from '@/components/loading-logo';
import Header from '@/components/public/header';
import HeroSection from '@/components/public/hero-section';
import AboutSection from '@/components/public/about-section';
import PortfolioSection from '@/components/public/portfolio-section';
import ContactSection from '@/components/public/contact-section';
import Footer from '@/components/public/footer';
import ProjectModal from '@/components/public/project-modal';
import StatsSection from '@/components/public/stats-section';
import GallerySection from '@/components/public/gallery-section';
import SkillsSection from '@/components/public/skills-section';
import ToolsSection from '@/components/public/tools-section';
import TestimonialSection from '@/components/public/testimonial-section';
import { ScrollToTop } from '@/components/public/scroll-to-top';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const firestore = useFirestore();

  const siteContentRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteContent', 'global') : null, [firestore]);
  const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#pkadmin') {
        router.push('/login');
      }
    };
    
    handleHashChange(); // Check on initial load
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingLogo />
      </div>
    );
  }

  if (siteContent?.isMaintenanceModeEnabled) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Under Maintenance</h1>
          <p className="text-muted-foreground">My portfolio is currently undergoing some updates. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background ${siteContent?.areAnimationsEnabled ? '' : 'no-animations'}`}>
      <Header siteName={siteContent?.siteName} />
      <main className="flex-grow">
        <HeroSection content={siteContent} />
        {(siteContent?.isAboutSectionVisible ?? true) && <AboutSection content={siteContent} />}
        {(siteContent?.isStatsSectionVisible ?? true) && <StatsSection content={siteContent} />}
        {(siteContent?.isSkillsSectionVisible ?? true) && <SkillsSection content={siteContent} />}
        {(siteContent?.isToolsSectionVisible ?? true) && <ToolsSection content={siteContent} />}
        {(siteContent?.isGallerySectionVisible ?? true) && <GallerySection content={siteContent} />}
        {(siteContent?.isPortfolioSectionVisible ?? true) && <PortfolioSection content={siteContent} onProjectClick={handleProjectClick} />}
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer content={siteContent} />
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <ScrollToTop />
    </div>
  );
}
