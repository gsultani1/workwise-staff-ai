
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Shift {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  type: string;
}

interface UserScheduleCardProps {
  userSchedule: Shift[];
  loading: boolean;
}

export const UserScheduleCard = ({ userSchedule, loading }: UserScheduleCardProps) => {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
        <CardDescription>Your upcoming shifts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {userSchedule.map((shift, index) => (
              <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{shift.day}</p>
                    <p className="text-sm text-muted-foreground">{shift.startTime} - {shift.endTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{shift.hours} hours</p>
                    <p className="text-sm text-muted-foreground">{shift.type}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">View Full Schedule</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
