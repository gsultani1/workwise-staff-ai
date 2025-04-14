
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface TimeOffBalance {
  vacation_days: number;
  sick_days: number;
  personal_days: number;
}

export const useTimeOffBalance = () => {
  const [balance, setBalance] = useState<TimeOffBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!profile?.employee_id) return;

      try {
        const { data, error } = await supabase
          .from('time_off_balances')
          .select('vacation_days, sick_days, personal_days')
          .eq('employee_id', profile.employee_id)
          .single();

        if (error) throw error;
        setBalance(data);
      } catch (error: any) {
        console.error('Error fetching time off balance:', error);
        toast({
          title: 'Error',
          description: 'Failed to load time off balance.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Set up real-time subscription
    const channel = supabase
      .channel('time-off-balance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_off_balances',
          filter: `employee_id=eq.${profile?.employee_id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setBalance(payload.new as TimeOffBalance);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.employee_id]);

  return { balance, loading };
};
