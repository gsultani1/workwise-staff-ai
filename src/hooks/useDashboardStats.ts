
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type DashboardStatsType = {
  staffOnDuty: { value: number | null; total: number | null };
  pendingTimeOff: { value: number | null };
  weeklyHours: { value: number | null };
  laborCost: { value: number | null };
  userHours: { value: number | null };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsType>({
    staffOnDuty: { value: null, total: null },
    pendingTimeOff: { value: null },
    weeklyHours: { value: null },
    laborCost: { value: null },
    userHours: { value: null }
  });
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
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
        
        // Fetch shifts to calculate weekly hours
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('start_time, end_time');
          
        if (shiftsError) throw shiftsError;
        
        // Calculate total weekly hours from shifts
        let totalWeeklyHours = 0;
        
        shiftsData.forEach((shift) => {
          if (shift.start_time && shift.end_time) {
            const startParts = shift.start_time.split(':');
            const endParts = shift.end_time.split(':');
            
            const startHours = parseInt(startParts[0], 10);
            const startMinutes = parseInt(startParts[1], 10);
            const endHours = parseInt(endParts[0], 10);
            const endMinutes = parseInt(endParts[1], 10);
            
            const totalHours = endHours - startHours;
            const totalMinutes = endMinutes - startMinutes;
            
            totalWeeklyHours += totalHours + (totalMinutes / 60);
          }
        });
        
        // Calculate labor cost (using average hourly rate)
        const avgHourlyRate = 25; // Simplified average hourly rate
        const laborCost = totalWeeklyHours * avgHourlyRate;
        
        // Get current user's scheduled hours (if profile exists)
        let userHours = 0;
        
        if (profile?.employee_id) {
          const { data: userShifts, error: userShiftsError } = await supabase
            .from('shifts')
            .select('start_time, end_time')
            .eq('employee_id', profile.employee_id);
            
          if (!userShiftsError && userShifts) {
            userShifts.forEach((shift) => {
              if (shift.start_time && shift.end_time) {
                const startParts = shift.start_time.split(':');
                const endParts = shift.end_time.split(':');
                
                const startHours = parseInt(startParts[0], 10);
                const startMinutes = parseInt(startParts[1], 10);
                const endHours = parseInt(endParts[0], 10);
                const endMinutes = parseInt(endParts[1], 10);
                
                const totalHours = endHours - startHours;
                const totalMinutes = endMinutes - startMinutes;
                
                userHours += totalHours + (totalMinutes / 60);
              }
            });
          }
        }
        
        setStats({
          staffOnDuty: { 
            value: activeEmployees,
            total: totalEmployees
          },
          pendingTimeOff: { value: pendingRequests.length },
          weeklyHours: { value: Math.round(totalWeeklyHours) },
          laborCost: { value: Math.round(laborCost) },
          userHours: { value: Math.round(userHours) }
        });
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, [user, profile]);

  return { stats, loading };
};
