
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const PredictiveStaffingPanel = () => {
  const recommendations = [
    { 
      role: 'Cashier', 
      current: 2, 
      recommended: 3, 
      priority: 'high',
      reason: 'Expected rush based on historical data'
    },
    { 
      role: 'Sales Associate', 
      current: 4, 
      recommended: 4, 
      priority: 'good',
      reason: 'Optimal coverage'
    },
    { 
      role: 'Customer Service', 
      current: 2, 
      recommended: 1, 
      priority: 'low',
      reason: 'Lower expected customer volume'
    }
  ];

  const getStatusColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'good':
        return 'text-workwise-green';
      case 'low':
        return 'text-amber-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressValue = (current: number, recommended: number) => {
    if (current === recommended) return 100;
    return (current / recommended) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Today's Recommendations</span>
        <span className="text-xs text-muted-foreground">Last updated 10 minutes ago</span>
      </div>

      {recommendations.map((rec) => (
        <div key={rec.role} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{rec.role}</span>
            <span className={`text-xs ${getStatusColor(rec.priority)}`}>
              {rec.current}/{rec.recommended} staff
            </span>
          </div>
          <Progress value={getProgressValue(rec.current, rec.recommended)} className="h-2" />
          <p className="text-xs text-muted-foreground">{rec.reason}</p>
        </div>
      ))}

      <div className="pt-2">
        <Button className="w-full bg-workwise-blue hover:bg-workwise-blue/90">
          Apply Recommendations
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
