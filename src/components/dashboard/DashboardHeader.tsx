
import React from 'react';
import { DashboardFilter } from '@/components/DashboardFilter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  onFilterChange: (filters: any) => void;
}

export const DashboardHeader = ({ onFilterChange }: DashboardHeaderProps) => {
  const { isAdmin, isManager } = useAuth();
  const hasManagementPrivileges = isAdmin || isManager;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to WorkWise Scheduler. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasManagementPrivileges && <DashboardFilter onFilterChange={onFilterChange} />}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Today:</span>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {!hasManagementPrivileges && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Employee View</AlertTitle>
          <AlertDescription>
            You're viewing the employee dashboard with limited information. Some financial and management data is restricted.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
