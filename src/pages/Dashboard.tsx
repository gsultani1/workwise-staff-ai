
import React, { useState } from 'react';
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

const Dashboard = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('shifts');

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Here you would typically fetch filtered data
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to WorkWise Scheduler. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardFilter onFilterChange={handleFilterChange} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Today:</span>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><Users className="h-4 w-4 text-muted-foreground" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current staff checked in for their shifts</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">out of 15 scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><Clock className="h-4 w-4 text-muted-foreground" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time off requests awaiting approval</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">requests awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><Calendar className="h-4 w-4 text-muted-foreground" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total scheduled hours for this week</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">total scheduled this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Labor Cost</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><TrendingUp className="h-4 w-4 text-muted-foreground" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Projected labor costs based on scheduled shifts</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,891</div>
              <p className="text-xs text-muted-foreground">projected for this week</p>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>

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

      {showAnalytics && (
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
                <TabsTrigger value="staffing">Staffing Efficiency</TabsTrigger>
              </TabsList>
              <TabsContent value="shifts">
                <UpcomingShifts />
              </TabsContent>
              <TabsContent value="staffing">
                <StaffingEfficiencyTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
};

export default Dashboard;
