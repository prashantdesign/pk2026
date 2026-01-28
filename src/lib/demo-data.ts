import type { Project } from '@/types';
import { Timestamp } from 'firebase/firestore';

// Note: Using serverTimestamp() is not possible in a static file.
// We'll use new Date() for local state and Firestore will convert it.
const now = Timestamp.now();

export const DEMO_PROJECTS: Omit<Project, 'id'>[] = [
  {
    title: 'Aura Branding',
    description: 'A complete branding and identity design for a new-age wellness company.',
    categoryId: 'Branding',
    imageUrl: 'https://images.unsplash.com/photo-1711779323810-c12e1df42816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YWJzdHJhY3QlMjBicmFuZGluZ3xlbnwwfHx8fDE3Njk1MjU1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    projectImages: [
      'https://images.unsplash.com/photo-1762365189058-7be5b07e038b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YnJhbmQlMjBtYXRlcmlhbHN8ZW58MHx8fHwxNzY5NTMxMDM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwcm9qZWN0JTIwbWVldGluZ3xlbnwwfHx8fDE3Njk2NTg5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    toolsUsed: 'Figma, Illustrator, Photoshop',
    order: 1,
    problem: 'Aura, a new wellness startup, needed a strong brand identity to stand out in a crowded market. They lacked a visual language that communicated their values of tranquility, nature, and modern science.',
    solution: 'We developed a comprehensive brand system, including a new logo, color palette inspired by natural gradients, and custom typography. The identity was applied across all digital and print materials, from the website to packaging, creating a cohesive and calming user experience.',
    outcome: 'The new branding was met with overwhelmingly positive feedback, leading to a 40% increase in online engagement and successfully positioning Aura as a premium and trustworthy wellness brand.',
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'SocialFeed App',
    description: 'A UI/UX design project for a mobile social media application.',
    categoryId: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1724862936518-ae7fcfc052c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzb2NpYWwlMjBtZWRpYXxlbnwwfHx8fDE3Njk0OTY2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    projectImages: [],
    toolsUsed: 'Figma, Spline',
    order: 2,
    problem: 'Existing social media apps were becoming cluttered and overwhelming for users. There was a need for a simpler, more intuitive interface focused on meaningful connections.',
    solution: 'We designed a minimalist UI centered around a chronological feed and direct messaging. By removing complex algorithms and intrusive ads, the user experience became more focused and enjoyable. Interactive prototypes were built in Figma to test and refine the user flow.',
    outcome: 'User testing showed a 95% satisfaction rate with the new design. The streamlined interface was praised for its ease of use and focus on content, proving that less can be more in social media design.',
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'The Modernist Magazine',
    description: 'Print and layout design for a quarterly architecture magazine.',
    categoryId: 'Print Design',
    imageUrl: 'https://images.unsplash.com/photo-1616080808758-b8a2fc2ec5d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwcmludCUyMGRlc2lnbnxlbnwwfHx8fDE3Njk1MzEwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    projectImages: [],
    toolsUsed: 'InDesign, Photoshop',
    order: 3,
    problem: 'The Modernist needed a fresh layout that reflected its content—bold, clean, and contemporary architecture. The previous design felt dated and failed to engage a younger audience.',
    solution: 'A new grid system was established, emphasizing white space and strong typographic hierarchy. We introduced a dynamic photo-led approach to feature articles, making the magazine more visually compelling. The cover design was also revamped to be more iconic and collectible.',
    outcome: 'The redesign contributed to a 25% increase in subscriptions and a significant boost in social media mentions. The magazine is now seen as a leader in design and has won several print design awards.',
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Fintech Dashboard',
    description: 'A data-driven UI/UX project for a financial analytics platform.',
    categoryId: 'UI/UX',
    imageUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx1aSUyMGRlc2lnbnxlbnwwfHx8fDE3Njk0OTI4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    projectImages: [],
    toolsUsed: 'Figma, After Effects',
    order: 4,
    problem: 'Financial analysts were struggling with complex, hard-to-navigate software. They needed a dashboard that could present vast amounts of data in a clear, actionable, and customizable way.',
    solution: 'We designed a modular dashboard where users could drag and drop widgets to create their own workspace. Data visualization was a key focus, with interactive charts and graphs that make complex data easy to understand. A dark mode was also implemented to reduce eye strain during long hours of use.',
    outcome: 'The new dashboard design reduced the time to find critical information by 60% and became the platform\'s most praised feature, directly contributing to a higher customer retention rate.',
    createdAt: now,
    updatedAt: now,
  }
];
