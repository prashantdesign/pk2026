'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { ContactMessage } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Mail, Calendar, User, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface MessageDetailClientProps {
  id: string;
}

export default function MessageDetailClient({ id }: MessageDetailClientProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const messageRef = useMemoFirebase(() =>
    firestore ? doc(firestore, 'contactMessages', id) : null
  , [firestore, id]);

  const { data: message, loading } = useDoc<ContactMessage>(messageRef);

  const handleToggleRead = async () => {
    if (!message || !messageRef) return;
    try {
      await updateDoc(messageRef, { isRead: !message.isRead });
      toast({
        title: "Success",
        description: `Message marked as ${!message.isRead ? 'read' : 'unread'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update message status.",
      });
    }
  };

  const handleDelete = async () => {
    // Implement delete if needed, but maybe just read/unread is enough for now.
    // User didn't explicitly ask for delete, but standard admin usually has it.
    // For now, let's stick to read/unread as per "detailed and interactive".
    // I'll leave it as a potential future enhancement or add it if easy.
    // Deleting is risky without confirmation. I'll skip delete for now to be safe.
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <Skeleton className="h-10 w-10 rounded-full" />
           <Skeleton className="h-8 w-48" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-8 w-64 mb-2" /><Skeleton className="h-4 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-32 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (!message) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Message Not Found</h2>
            <p className="text-muted-foreground mb-8">The message you are looking for does not exist or has been deleted.</p>
            <Button onClick={() => router.push('/admin/messages')}>Back to Messages</Button>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Messages
        </Button>
        <div className="flex items-center gap-2">
            <Button variant={message.isRead ? "outline" : "default"} onClick={handleToggleRead} className="gap-2">
                {message.isRead ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        {message.name}
                        <Badge variant={message.isRead ? "secondary" : "default"}>{message.isRead ? 'Read' : 'Unread'}</Badge>
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm gap-4">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {message.email}</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {message.timestamp ? format(message.timestamp.toDate(), 'PPpp') : 'Unknown Date'}
                        </span>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-lg">{message.message}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
