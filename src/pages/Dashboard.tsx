
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats, DashboardStatsType } from '@/components/dashboard/DashboardStats';
import { AnalyticsToggle } from '@/components/dashboard/AnalyticsToggle';
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard';
import { ShiftsAndStaffingCard } from '@/components/dashboard/ShiftsAndStaffingCard';
import { PredictiveStaffingCard } from '@/components/dashboard/PredictiveStaffingCard';
import { UserScheduleCard } from '@/components/dashboard/UserScheduleCard';

const Dashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { isAdmin, isManager, user, profile } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
    staffOnDuty: { value: null, total: null },
    pendingTimeOff: { value: null },
    weeklyHours: { value: null },
    laborCost: { value: null },
    userHours: { value: null }
  });
  const [userSchedule, setUserSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const hasManagementPrivileges = isAdmin || isManager;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total and active employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('id, status');
        
        if (employeesError) throw employeesError;
        
        const totalEmployees = employeesData.length;
        const activeEmployees = employeesData.filter(emp => emp.status === 'Active').length;
        
        // Fetch pending time off requests
        const { data: pendingRequests, error: requestsError } = await supabase
          .from('time_off_requests')
          .select('id')
          .eq('status', 'pending');
          
        if (requestsError) throw requestsError;
        
        // Calculate weekly hours (simplified)
        const weeklyHours = activeEmployees * 38; // Average 38 hours per active employee
        
        // Estimate labor cost (simplified)
        const avgHourlyRate = 25; // Adjusted average hourly rate
        const laborCost = weeklyHours * avgHourlyRate;
        
        // Get current user's scheduled hours (placeholder, would typically come from shifts table)
        const userHours = 38; // Standard work week
        
        setDashboardStats({
          staffOnDuty: { 
            value: Math.round(activeEmployees * 0.8), // Assume 80% are on duty
            total: totalEmployees
          },
          pendingTimeOff: { value: pendingRequests.length },
          weeklyHours: { value: weeklyHours },
          laborCost: { value: laborCost },
          userHours: { value: userHours }
        });
        
        // TODO: Implement actual user schedule fetching
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const friday = new Date(today);
        friday.setDate(friday.getDate() + (5 - friday.getDay()) % 7);
        const saturday = new Date(friday);
        saturday.setDate(friday.getDate() + 1);
        
        setUserSchedule([
          {
            day: 'Tomorrow',
            date: tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            startTime: '9:00 AM',
            endTime: '5:00 PM',
            hours: 8,
            type: 'Regular Shift'
          },
          // More schedule entries would typically come from a shifts table
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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
      
      <DashboardStats stats={dashboardStats} loading={loading} />

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
