
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export type DashboardStatsType = {
  staffOnDuty: { value: number | null; total: number | null };
  pendingTimeOff: { value: number | null };
  weeklyHours: { value: number | null };
  laborCost: { value: number | null };
  userHours: { value: number | null };
}

interface DashboardStatsProps {
  stats: DashboardStatsType;
  loading: boolean;
}

export const DashboardStats = ({ stats, loading }: DashboardStatsProps) => {
  const { isAdmin, isManager } = useAuth();
  const hasManagementPrivileges = isAdmin || isManager;

  const renderStat = (title: string, value: any, icon: React.ReactNode, subtitle: string, tooltip: string) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{icon}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20 mb-1" />
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <TooltipProvider>
        {renderStat(
          "Staff on Duty", 
          loading ? "" : `${stats.staffOnDuty.value}`,
          <Users className="h-4 w-4 text-muted-foreground" />,
          loading ? "" : `out of ${stats.staffOnDuty.total} scheduled`,
          "Current staff checked in for their shifts"
        )}

        {renderStat(
          "Pending Time Off", 
          loading ? "" : stats.pendingTimeOff.value,
          <Clock className="h-4 w-4 text-muted-foreground" />,
          "requests awaiting approval",
          "Time off requests awaiting approval"
        )}

        {renderStat(
          "Weekly Hours", 
          loading ? "" : stats.weeklyHours.value,
          <Calendar className="h-4 w-4 text-muted-foreground" />,
          "total scheduled this week",
          "Total scheduled hours for this week"
        )}

        {hasManagementPrivileges ? (
          renderStat(
            "Labor Cost", 
            loading ? "" : `$${stats.laborCost.value?.toLocaleString()}`,
            <TrendingUp className="h-4 w-4 text-muted-foreground" />,
            "projected for this week",
            "Projected labor costs based on scheduled shifts"
          )
        ) : (
          renderStat(
            "Your Hours", 
            loading ? "" : stats.userHours.value,
            <Clock className="h-4 w-4 text-muted-foreground" />,
            "scheduled this week",
            "Your scheduled hours for this week"
          )
        )}
      </TooltipProvider>
    </div>
  );
};
