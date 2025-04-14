
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
  const { isAdmin, isManager, user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
    staffOnDuty: { value: null, total: null },
    pendingTimeOff: { value: null },
    weeklyHours: { value: null },
    laborCost: { value: null },
    userHours: { value: null }
  });
  const [userSchedule, setUserSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Only managers and admins can access sensitive data
  const hasManagementPrivileges = isAdmin || isManager;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch staff on duty count (active employees)
        const { data: activeEmployees, error: employeesError } = await supabase
          .from('employees')
          .select('id')
          .eq('status', 'Active');
        
        if (employeesError) throw employeesError;
        
        // Fetch pending time off requests
        const { data: pendingRequests, error: requestsError } = await supabase
          .from('time_off_requests')
          .select('id')
          .eq('status', 'pending');
          
        if (requestsError) throw requestsError;
        
        // Calculate weekly hours for all staff
        // In a real app, this would come from a shifts or schedule table
        // Using placeholder calculation based on active employees
        const weeklyHours = activeEmployees.length * 38; // Average 38 hours per employee
        
        // Calculate labor cost (simplified estimate)
        // In a real app, this would be calculated from actual payroll data
        const avgHourlyRate = 15; // Placeholder: average hourly rate
        const laborCost = weeklyHours * avgHourlyRate;
        
        // Get current user's scheduled hours (simplified for demo)
        // In a real app, would query a shifts table filtered by current user
        const userHours = 38; // Placeholder value
        
        // Update state with fetched values
        setDashboardStats({
          staffOnDuty: { 
            value: Math.round(activeEmployees.length * 0.8), // Assume 80% are on duty now 
            total: activeEmployees.length
          },
          pendingTimeOff: { value: pendingRequests.length },
          weeklyHours: { value: weeklyHours },
          laborCost: { value: laborCost },
          userHours: { value: userHours }
        });
        
        // Simulate fetching user's schedule
        // In a real app, would come from a shifts or schedule table
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
          {
            day: 'Friday',
            date: friday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            startTime: '10:00 AM',
            endTime: '6:00 PM',
            hours: 8,
            type: 'Regular Shift'
          },
          {
            day: 'Saturday',
            date: saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            startTime: '8:00 AM',
            endTime: '4:00 PM',
            hours: 8,
            type: 'Weekend Shift'
          }
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
    // Here you would typically fetch filtered data
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
