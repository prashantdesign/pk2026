import React from 'react';
import MessageDetailClient from '@/components/admin/message-detail-client';

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MessageDetailClient id={id} />;
}
