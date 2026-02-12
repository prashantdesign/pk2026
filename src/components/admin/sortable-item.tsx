'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 mb-2 bg-card p-2 rounded-md border touch-none">
        <div {...attributes} {...listeners} className="cursor-grab p-2 hover:bg-muted rounded-md touch-none">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
  );
}
