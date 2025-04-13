
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export interface TimeOffRequest {
  id: number;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'denied';
}

export const TimeOffRequests = () => {
  const [requests, setRequests] = useState<TimeOffRequest[]>([
    {
      id: 1,
      employee: 'Robert Davis',
      type: 'Vacation',
      startDate: '04/15/2025',
      endDate: '04/18/2025',
      dateSubmitted: '04/01/2025',
      status: 'pending'
    },
    {
      id: 2,
      employee: 'Lisa Kim',
      type: 'Sick Leave',
      startDate: '04/12/2025',
      endDate: '04/12/2025',
      dateSubmitted: '04/11/2025',
      status: 'pending'
    },
    {
      id: 3,
      employee: 'Carlos Mendez',
      type: 'Personal Leave',
      startDate: '04/20/2025',
      endDate: '04/21/2025',
      dateSubmitted: '04/05/2025',
      status: 'pending'
    }
  ]);
  
  // Register for new time off request events
  React.useEffect(() => {
    const handleNewRequest = (event: Event) => {
      const customEvent = event as CustomEvent<TimeOffRequest>;
      setRequests(prev => [...prev, customEvent.detail]);
    };

    document.addEventListener('newTimeOffRequest', handleNewRequest);
    
    return () => {
      document.removeEventListener('newTimeOffRequest', handleNewRequest);
    };
  }, []);
  
  const handleApprove = (id: number) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
    
    toast({
      title: 'Request Approved',
      description: 'The time off request has been approved.',
    });
  };
  
  const handleDeny = (id: number) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: 'denied' } : request
      )
    );
    
    toast({
      title: 'Request Denied',
      description: 'The time off request has been denied.',
      variant: 'destructive',
    });
  };
  
  // Filter to show only pending requests
  const pendingRequests = requests.filter(request => request.status === 'pending');
  
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
                  <h4 className="text-lg font-medium">{request.employee}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-workwise-blue/10 hover:bg-workwise-blue/20 text-workwise-blue">
                      {request.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Submitted on {request.dateSubmitted}
                    </span>
                  </div>
                  <p className="text-sm">
                    {request.startDate === request.endDate 
                      ? `Date: ${request.startDate}` 
                      : `Date Range: ${request.startDate} - ${request.endDate}`}
                  </p>
                </div>
                
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
              </div>
            </div>
          </React.Fragment>
        ))
      )}
    </div>
  );
};
