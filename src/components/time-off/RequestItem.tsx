
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TimeOffRequest } from '@/types/employee';
import { RequestActions } from './RequestActions';
import { useAuth } from '@/contexts/AuthContext';

interface RequestItemProps {
  request: TimeOffRequest;
}

export const RequestItem: React.FC<RequestItemProps> = ({ request }) => {
  const { isAdmin, isManager } = useAuth();
  const canApprove = isAdmin || isManager;

  return (
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
        
        {canApprove && <RequestActions requestId={request.id} />}
      </div>
    </div>
  );
};
