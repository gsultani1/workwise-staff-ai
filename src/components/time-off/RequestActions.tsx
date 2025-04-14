
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RequestActionsProps {
  requestId: string;
}

export const RequestActions = ({ requestId }: RequestActionsProps) => {
  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('time_off_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
      
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
  
  const handleDeny = async () => {
    try {
      const { error } = await supabase
        .from('time_off_requests')
        .update({ status: 'denied' })
        .eq('id', requestId);
      
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

  return (
    <div className="flex items-center space-x-2 self-end md:self-center">
      <Button
        size="sm"
        variant="outline"
        className="border-workwise-green text-workwise-green hover:bg-workwise-green/10 hover:text-workwise-green"
        onClick={handleApprove}
      >
        <Check className="mr-2 h-4 w-4" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleDeny}
      >
        <X className="mr-2 h-4 w-4" />
        Deny
      </Button>
    </div>
  );
};
