export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  tags: string[];
  images: string[];
  mainImageUrl: string;
  caseStudy?: {
    problem: string;
    solution: string;
    tools: string;
    outcome: string;
  };
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    showCta: boolean;
  };
  about: {
    bio: string;
    stats: {
      projects: number;
      experience: number;
      clients: number;
    };
    tools: string[];
  };
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: any; // Firestore Timestamp
    read: boolean;
}
