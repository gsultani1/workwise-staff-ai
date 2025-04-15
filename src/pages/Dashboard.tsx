
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { AnalyticsToggle } from '@/components/dashboard/AnalyticsToggle';
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard';
import { ShiftsAndStaffingCard } from '@/components/dashboard/ShiftsAndStaffingCard';
import { PredictiveStaffingCard } from '@/components/dashboard/PredictiveStaffingCard';
import { UserScheduleCard } from '@/components/dashboard/UserScheduleCard';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const Dashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { isAdmin, isManager } = useAuth();
  const { stats, loading } = useDashboardStats();
  const [userSchedule, setUserSchedule] = useState([]);
  
  const hasManagementPrivileges = isAdmin || isManager;

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Implement actual filtering logic
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader onFilterChange={handleFilterChange} />
      
      <DashboardStats stats={stats} loading={loading} />

      {hasManagementPrivileges && (
        <AnalyticsToggle 
          showAnalytics={showAnalytics} 
          toggleAnalytics={toggleAnalytics}
        />
      )}

      {showAnalytics && hasManagementPrivileges && <AnalyticsCard />}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <ShiftsAndStaffingCard />
        
        {hasManagementPrivileges ? (
          <PredictiveStaffingCard />
        ) : (
          <UserScheduleCard userSchedule={userSchedule} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
