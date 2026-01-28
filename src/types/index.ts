import { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  projectImages: string[];
  toolsUsed: string;
  order: number;
  problem?: string;
  solution?: string;
  outcome?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface SiteContent {
  id: string;
  siteName?: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
  aboutText: string;
  aboutImageUrl?: string;
  stats?: {
    value: string;
    label: string;
  }[];
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
  theme?: 'light' | 'dark';
  isMaintenanceModeEnabled?: boolean;
  areAnimationsEnabled?: boolean;
  isAboutSectionVisible?: boolean;
  isStatsSectionVisible?: boolean;
  isPortfolioSectionVisible?: boolean;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: Timestamp;
    isRead: boolean;
}
