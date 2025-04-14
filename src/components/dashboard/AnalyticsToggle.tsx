
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface AnalyticsToggleProps {
  showAnalytics: boolean;
  toggleAnalytics: () => void;
}

export const AnalyticsToggle = ({ showAnalytics, toggleAnalytics }: AnalyticsToggleProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleAnalytics}
        className="flex items-center gap-1"
      >
        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        <ArrowUpRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
