
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LaborAnalyticsChart } from '@/components/LaborAnalyticsChart';

export const AnalyticsCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Labor Analytics</CardTitle>
        <CardDescription>Breakdown of labor costs by department</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <LaborAnalyticsChart />
      </CardContent>
    </Card>
  );
};
