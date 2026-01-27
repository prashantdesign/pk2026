"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types';
import Header from '@/components/public/header';
import HeroSection from '@/components/public/hero-section';
import AboutSection from '@/components/public/about-section';
import PortfolioSection from '@/components/public/portfolio-section';
import ContactSection from '@/components/public/contact-section';
import Footer from '@/components/public/footer';
import ProjectModal from '@/components/public/project-modal';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#pkadmin') {
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <PortfolioSection onProjectClick={handleProjectClick} />
        <ContactSection />
      </main>
      <Footer />
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
