"use client";

import React, { useState } from 'react';
import type { Project, SiteContent } from '@/types';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import Header from '@/components/public/header';
import Footer from '@/components/public/footer';
import PortfolioSection from '@/components/public/portfolio-section';
import ProjectModal from '@/components/public/project-modal';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const firestore = useFirestore();

  const siteContentRef = useMemoFirebase(() => firestore ? doc(firestore, 'siteContent', 'global') : null, [firestore]);
  const { data: siteContent, loading } = useDoc<SiteContent>(siteContentRef);

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
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background ${siteContent?.areAnimationsEnabled ? '' : 'no-animations'}`}>
      <Header siteName={siteContent?.siteName} />
      <main className="flex-grow pt-20">
        <PortfolioSection
            content={siteContent}
            onProjectClick={handleProjectClick}
            showFilters={true}
            showViewAll={false}
        />
      </main>
      <Footer content={siteContent} />
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
