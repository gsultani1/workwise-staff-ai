
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { InboxDialog } from './InboxDialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

export const InboxButton = () => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.employee_id) return;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', profile.employee_id)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Set up subscription for new messages
    const channel = supabase
      .channel('unread-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${profile.employee_id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${profile.employee_id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.employee_id]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsInboxOpen(true)}
        className="relative"
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="default" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-workwise-blue text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <InboxDialog
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </>
  );
};
