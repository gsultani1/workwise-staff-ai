
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ChatDialog } from './ChatDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Conversation {
  employee_id: string;
  first_name: string;
  last_name: string;
  latest_message: string;
  latest_timestamp: string;
  unread_count: number;
}

interface InboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InboxDialog = ({ isOpen, onClose }: InboxDialogProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { profile } = useAuth();

  useEffect(() => {
    if (!isOpen || !profile?.employee_id) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Use the get_conversations function that we've created in the SQL migration
        const { data, error } = await supabase
          .from('messages')
          .select(`
            sender_id,
            recipient_id,
            content,
            created_at,
            read_at,
            sender:employees!sender_id(first_name, last_name),
            recipient:employees!recipient_id(first_name, last_name)
          `)
          .or(`sender_id.eq.${profile.employee_id},recipient_id.eq.${profile.employee_id}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        // Process data to get unique conversations with latest message
        const conversationsMap = new Map<string, Conversation>();
        
        data?.forEach(message => {
          const isIncoming = message.recipient_id === profile.employee_id;
          const contactId = isIncoming ? message.sender_id : message.recipient_id;
          
          // Skip if it's a message to self
          if (message.sender_id === message.recipient_id) return;
          
          const contact = isIncoming ? message.sender : message.recipient;
          if (!contact) return;
          
          const unreadCount = isIncoming && !message.read_at ? 1 : 0;
          
          if (!conversationsMap.has(contactId)) {
            conversationsMap.set(contactId, {
              employee_id: contactId,
              first_name: contact.first_name,
              last_name: contact.last_name,
              latest_message: message.content,
              latest_timestamp: message.created_at,
              unread_count: unreadCount
            });
          } else {
            const existing = conversationsMap.get(contactId)!;
            const messageDate = new Date(message.created_at);
            const existingDate = new Date(existing.latest_timestamp);
            
            // Only update if this message is newer than what we have
            if (messageDate > existingDate) {
              existing.latest_message = message.content;
              existing.latest_timestamp = message.created_at;
            }
            
            if (isIncoming && !message.read_at) {
              existing.unread_count += 1;
            }
          }
        });
        
        setConversations(Array.from(conversationsMap.values()));
      } catch (err) {
        console.error('Exception fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Set up subscription for new messages
    const channel = supabase
      .channel('inbox-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id=eq.${profile.employee_id},recipient_id=eq.${profile.employee_id})`
        },
        () => {
          // Just refresh the entire list when any new message arrives
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, profile?.employee_id]);

  const openChat = (employeeId: string, firstName: string, lastName: string) => {
    setSelectedChat({ 
      id: employeeId, 
      name: `${firstName} ${lastName}` 
    });
  };

  const filteredConversations = activeTab === 'unread'
    ? conversations.filter(c => c.unread_count > 0)
    : conversations;

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  return (
    <>
      <Dialog open={isOpen && !selectedChat} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inbox</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div 
                      key={conversation.employee_id}
                      className={`p-3 rounded-md border cursor-pointer hover:bg-muted/50 ${
                        conversation.unread_count > 0 ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => openChat(
                        conversation.employee_id, 
                        conversation.first_name, 
                        conversation.last_name
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-workwise-blue flex items-center justify-center text-white font-medium">
                            {conversation.first_name.charAt(0)}{conversation.last_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {conversation.first_name} {conversation.last_name}
                              {conversation.unread_count > 0 && (
                                <Badge variant="default" className="ml-2 bg-workwise-blue text-white">
                                  {conversation.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {conversation.latest_message}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.latest_timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    {activeTab === 'unread' 
                      ? 'No unread messages' 
                      : 'No conversations yet'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      {selectedChat && (
        <ChatDialog
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          recipientId={selectedChat.id}
          recipientName={selectedChat.name}
        />
      )}
    </>
  );
};
