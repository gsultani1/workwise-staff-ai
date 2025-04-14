
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TimeOffRequest } from '@/types/employee';
import { toast } from '@/hooks/use-toast';

export const useTimeOffRequests = () => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('time_off_requests')
          .select(`
            *,
            employees:employee_id (
              first_name,
              last_name
            )
          `)
          .order('date_submitted', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const transformedData: TimeOffRequest[] = data.map(req => ({
            ...req,
            employee_first_name: req.employees?.first_name || 'Unknown',
            employee_last_name: req.employees?.last_name || 'User',
            status: req.status as "pending" | "approved" | "denied",
          }));
          
          setRequests(transformedData);
        }
      } catch (error: any) {
        console.error('Error fetching time off requests:', error);
        toast({
          title: 'Failed to load requests',
          description: error.message || 'There was an error loading the time off requests.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'time_off_requests' 
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the full record with employee details
            fetchRequestWithEmployeeDetails(payload.new.id);
          } else if (payload.eventType === 'UPDATE') {
            setRequests(prev => 
              prev.map(request => 
                request.id === payload.new.id ? 
                  { ...request, ...payload.new, status: payload.new.status as "pending" | "approved" | "denied" } : 
                  request
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => 
              prev.filter(request => request.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequestWithEmployeeDetails = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('time_off_requests')
        .select(`
          *,
          employees:employee_id (
            first_name,
            last_name
          )
        `)
        .eq('id', requestId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newRequest: TimeOffRequest = {
          ...data,
          employee_first_name: data.employees?.first_name || 'Unknown',
          employee_last_name: data.employees?.last_name || 'User',
          status: data.status as "pending" | "approved" | "denied",
        };
        
        setRequests(prev => [newRequest, ...prev]);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  return { requests, loading };
};
