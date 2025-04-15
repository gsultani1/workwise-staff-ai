
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCheck, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read_at: string | null;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export const ChatDialog = ({ isOpen, onClose, recipientId, recipientName }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { profile } = useAuth();
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !profile?.employee_id || !recipientId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${profile.employee_id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${profile.employee_id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setMessages(data || []);
        
        // Mark received messages as read
        if (data && data.length > 0) {
          const unreadMessages = data.filter(msg => 
            msg.recipient_id === profile.employee_id && 
            msg.sender_id === recipientId && 
            msg.read_at === null
          );
          
          if (unreadMessages.length > 0) {
            // Update read status for all unread messages from this sender
            await supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .in('id', unreadMessages.map(msg => msg.id));
          }
        }
      } catch (err) {
        console.error('Exception fetching messages:', err);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id=eq.${profile.employee_id},recipient_id=eq.${recipientId}),and(sender_id=eq.${recipientId},recipient_id=eq.${profile.employee_id}))`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(current => [...current, newMsg]);
          
          // If the message is from the other person, mark it as read
          if (newMsg.sender_id === recipientId && newMsg.recipient_id === profile.employee_id) {
            supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, profile?.employee_id, recipientId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !profile?.employee_id) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        sender_id: profile.employee_id,
        recipient_id: recipientId
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat with {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, index) => {
                  const isLastMessage = index === messages.length - 1;
                  const isSender = message.sender_id === profile?.employee_id;
                  
                  return (
                    <div
                      key={message.id}
                      ref={isLastMessage ? lastMessageRef : null}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isSender
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="text-xs opacity-70">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isSender && (
                            <span className="text-xs">
                              {message.read_at ? (
                                <CheckCheck className="h-3 w-3 inline" />
                              ) : (
                                <Check className="h-3 w-3 inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 p-4 border-t">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
