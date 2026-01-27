"use client";

import React from 'react';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { ContactMessage } from '@/types';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Mail, MailOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function MessagesClient() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const messagesQuery = firestore ? query(collection(firestore, 'messages'), orderBy('createdAt', 'desc')) : null;
  const { data: messages, loading } = useCollection<ContactMessage>(messagesQuery);
  
  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    if (!firestore) return;
      try {
          await updateDoc(doc(firestore, "messages", id), { read: !currentStatus });
          toast({ title: `Message marked as ${!currentStatus ? 'read' : 'unread'}.` });
      } catch (error) {
          toast({ variant: "destructive", title: "Failed to update message status." });
      }
  }

  const handleDelete = async (id: string) => {
      if (!firestore || !window.confirm("Are you sure you want to delete this message?")) return;
      try {
          await deleteDoc(doc(firestore, "messages", id));
          toast({ title: "Message deleted successfully." });
      } catch (error) {
          toast({ variant: "destructive", title: "Failed to delete message." });
      }
  }
  
  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? messages.map((message) => (
              <TableRow key={message.id} className={!message.read ? 'font-bold' : ''}>
                <TableCell>
                    <Badge variant={message.read ? 'secondary' : 'default'}>{message.read ? 'Read' : 'Unread'}</Badge>
                </TableCell>
                <TableCell>
                    <div>{message.name}</div>
                    <div className="text-sm text-muted-foreground">{message.email}</div>
                </TableCell>
                <TableCell className="max-w-sm truncate">{message.message}</TableCell>
                <TableCell>{message.createdAt ? format(message.createdAt.toDate(), 'PP pp') : 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleReadStatus(message.id, message.read)}>
                        {message.read ? <Mail className="mr-2 h-4 w-4" /> : <MailOpen className="mr-2 h-4 w-4" />}
                         Mark as {message.read ? 'Unread' : 'Read'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(message.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No messages received yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
