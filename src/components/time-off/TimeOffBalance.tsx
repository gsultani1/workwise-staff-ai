
import React from 'react';
import { Label } from '@/components/ui/label';
import { useTimeOffBalance } from '@/hooks/useTimeOffBalance';
import { Skeleton } from '@/components/ui/skeleton';

export const TimeOffBalance = () => {
  const { balance, loading } = useTimeOffBalance();

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Time Off Balance</Label>
        <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Time Off Balance</Label>
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">
            {balance?.vacation_days ?? 0}
          </div>
          <div className="text-xs text-muted-foreground">Vacation Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">
            {balance?.sick_days ?? 0}
          </div>
          <div className="text-xs text-muted-foreground">Sick Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-workwise-blue">
            {balance?.personal_days ?? 0}
          </div>
          <div className="text-xs text-muted-foreground">Personal Days</div>
        </div>
      </div>
    </div>
  );
};
