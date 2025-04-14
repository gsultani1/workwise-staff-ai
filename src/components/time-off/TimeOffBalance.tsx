
import React from 'react';
import { Label } from '@/components/ui/label';

export const TimeOffBalance = () => {
  return (
    <div className="space-y-2">
      <Label>Time Off Balance</Label>
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">12</div>
          <div className="text-xs text-muted-foreground">Vacation Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">5</div>
          <div className="text-xs text-muted-foreground">Sick Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">3</div>
          <div className="text-xs text-muted-foreground">Personal Days</div>
        </div>
      </div>
    </div>
  );
};
