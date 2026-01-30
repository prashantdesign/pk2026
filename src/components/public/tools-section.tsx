'use client';
import type { SiteContent } from '@/types';
import Image from 'next/image';

export default function ToolsSection({ content }: { content: SiteContent | null }) {
    if (!content?.tools || content.tools.length === 0) {
        return null;
    }
  
    return (
      <section id="tools" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{content.toolsSectionTitle || 'Tools I Use'}</h2>
             {content.toolsSectionDescription && (
              <p className="mt-4 text-lg text-muted-foreground">{content.toolsSectionDescription}</p>
            )}
          </div>
  
          <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-8 justify-items-center">
            {content.tools.map((tool, index) => (
              <div key={index} className="flex flex-col items-center gap-2 text-center w-24">
                <div className="w-20 h-20 relative p-4 bg-muted rounded-full flex items-center justify-center transition-transform hover:scale-110">
                    {tool.iconUrl ? (
                        <Image src={tool.iconUrl} alt={tool.name} fill className="object-contain p-2" />
                    ) : (
                        <span className="text-xs text-muted-foreground text-center">{tool.name}</span>
                    )}
                </div>
                <p className="font-semibold text-sm truncate w-full">{tool.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
