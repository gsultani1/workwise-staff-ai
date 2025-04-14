
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictiveStaffingPanel } from '@/components/PredictiveStaffingPanel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

export const PredictiveStaffingCard = () => {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            Predictive Staffing 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><AlertCircle className="h-4 w-4 text-amber-500" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI-powered staffing recommendations based on historical data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>AI-powered recommendations</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <PredictiveStaffingPanel />
      </CardContent>
    </Card>
  );
};
