import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import PageTransition from '@/components/page-transition';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PK Design Studio',
  description: 'A professional portfolio for a creative Graphic, UI, and Brand Designer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "PK Design Studio",
    "url": "https://pkdesign.studio",
    "sameAs": [
      "https://www.linkedin.com/in/pkdesign",
      "https://twitter.com/pkdesign"
    ],
    "jobTitle": "Graphic & UI Designer",
    "description": "A professional portfolio for a creative Graphic, UI, and Brand Designer."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <FirebaseClientProvider>
          <ThemeProvider>
            <ScrollProgress />
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
            <FirebaseErrorListener />
          </ThemeProvider>
        </FirebaseClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
