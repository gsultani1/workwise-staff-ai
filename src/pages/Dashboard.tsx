
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Calendar, TrendingUp, AlertCircle, Info, ArrowUpRight } from 'lucide-react';
import { PredictiveStaffingPanel } from '@/components/PredictiveStaffingPanel';
import { UpcomingShifts } from '@/components/UpcomingShifts';
import { DashboardFilter } from '@/components/DashboardFilter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { LaborAnalyticsChart } from '@/components/LaborAnalyticsChart';
import { StaffingEfficiencyTable } from '@/components/StaffingEfficiencyTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('shifts');
  const { isAdmin, isManager, user, profile } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
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

  const renderStat = (title, value, icon, subtitle, tooltip) => {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to WorkWise Scheduler. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasManagementPrivileges && <DashboardFilter onFilterChange={handleFilterChange} />}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Today:</span>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          {renderStat(
            "Staff on Duty", 
            loading ? "" : `${dashboardStats.staffOnDuty.value}`,
            <Users className="h-4 w-4 text-muted-foreground" />,
            loading ? "" : `out of ${dashboardStats.staffOnDuty.total} scheduled`,
            "Current staff checked in for their shifts"
          )}

          {renderStat(
            "Pending Time Off", 
            loading ? "" : dashboardStats.pendingTimeOff.value,
            <Clock className="h-4 w-4 text-muted-foreground" />,
            "requests awaiting approval",
            "Time off requests awaiting approval"
          )}

          {renderStat(
            "Weekly Hours", 
            loading ? "" : dashboardStats.weeklyHours.value,
            <Calendar className="h-4 w-4 text-muted-foreground" />,
            "total scheduled this week",
            "Total scheduled hours for this week"
          )}

          {hasManagementPrivileges ? (
            renderStat(
              "Labor Cost", 
              loading ? "" : `$${dashboardStats.laborCost.value?.toLocaleString()}`,
              <TrendingUp className="h-4 w-4 text-muted-foreground" />,
              "projected for this week",
              "Projected labor costs based on scheduled shifts"
            )
          ) : (
            renderStat(
              "Your Hours", 
              loading ? "" : dashboardStats.userHours.value,
              <Clock className="h-4 w-4 text-muted-foreground" />,
              "scheduled this week",
              "Your scheduled hours for this week"
            )
          )}
        </TooltipProvider>
      </div>

      {hasManagementPrivileges && (
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
      )}

      {showAnalytics && hasManagementPrivileges && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Labor Analytics</CardTitle>
            <CardDescription>Breakdown of labor costs by department</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <LaborAnalyticsChart />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
            <CardDescription>Shifts for the next 3 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="shifts">Upcoming Shifts</TabsTrigger>
                {hasManagementPrivileges && (
                  <TabsTrigger value="staffing">Staffing Efficiency</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="shifts">
                <UpcomingShifts />
              </TabsContent>
              {hasManagementPrivileges && (
                <TabsContent value="staffing">
                  <StaffingEfficiencyTable />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
        {hasManagementPrivileges ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Predictive Staffing 
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><AlertCircle className="h-4 w-4 text-amber-500" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI-powered staffing recommendations based on historical data</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <PredictiveStaffingPanel />
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
