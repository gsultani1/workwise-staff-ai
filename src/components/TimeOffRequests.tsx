
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { RequestItem } from './time-off/RequestItem';
import { useTimeOffRequests } from '@/hooks/useTimeOffRequests';

export const TimeOffRequests = () => {
  const { requests, loading } = useTimeOffRequests();
  
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
            <RequestItem request={request} />
          </React.Fragment>
        ))
      )}
    </div>
  );
};
