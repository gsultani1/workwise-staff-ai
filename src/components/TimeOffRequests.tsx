import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TimeOffRequest } from '@/types/employee';

export const TimeOffRequests = () => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isManager } = useAuth();
  const canApprove = isAdmin || isManager;
  
  // Fetch time off requests with employee details
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
          // Transform the data to flatten the employee details and ensure type safety
          const transformedData: TimeOffRequest[] = data.map(req => ({
            ...req,
            employee_first_name: req.employees?.first_name || 'Unknown',
            employee_last_name: req.employees?.last_name || 'User',
            status: req.status as "pending" | "approved" | "denied", // Cast to the specific allowed values
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
    
    // Helper function to fetch a single request with employee details
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
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_off_requests')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Request Approved',
        description: 'The time off request has been approved.',
      });
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: 'Action failed',
        description: error.message || 'There was an error approving the request.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeny = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_off_requests')
        .update({ status: 'denied' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Request Denied',
        description: 'The time off request has been denied.',
        variant: 'destructive',
      });
    } catch (error: any) {
      console.error('Error denying request:', error);
      toast({
        title: 'Action failed',
        description: error.message || 'There was an error denying the request.',
        variant: 'destructive',
      });
    }
  };
  
  // Filter to show only pending requests
  const pendingRequests = requests.filter(request => request.status === 'pending');
  
  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading requests...</div>;
  }
  
  return (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No pending time off requests.</p>
        </div>
      ) : (
        pendingRequests.map((request, index) => (
          <React.Fragment key={request.id}>
            {index > 0 && <Separator />}
            <div className="py-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-lg font-medium">
                    {request.employee_first_name} {request.employee_last_name}
                  </h4>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-workwise-blue/10 hover:bg-workwise-blue/20 text-workwise-blue">
                      {request.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Submitted on {new Date(request.date_submitted).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">
                    {request.start_date === request.end_date 
                      ? `Date: ${request.start_date}` 
                      : `Date Range: ${request.start_date} - ${request.end_date}`}
                  </p>
                </div>
                
                {canApprove && (
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-workwise-green text-workwise-green hover:bg-workwise-green/10 hover:text-workwise-green"
                      onClick={() => handleApprove(request.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeny(request.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Deny
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ))
      )}
    </div>
  );
};
