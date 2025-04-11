
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, DollarSign, Clock, UsersIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LaborAnalyticsChart } from '@/components/LaborAnalyticsChart';
import { StaffingEfficiencyTable } from '@/components/StaffingEfficiencyTable';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track labor costs, staffing efficiency, and workforce metrics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labor Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-workwise-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5.2%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,420</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-destructive">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.4%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor as % of Sales</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-workwise-green">
                <TrendingDown className="mr-1 h-3 w-3" />
                -1.2%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-workwise-green">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.1%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="labor">
        <TabsList>
          <TabsTrigger value="labor">Labor Analytics</TabsTrigger>
          <TabsTrigger value="efficiency">Staffing Efficiency</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="labor" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Labor Cost Trends</CardTitle>
                  <CardDescription>Monthly labor costs by department</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  Last 6 Months
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LaborAnalyticsChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staffing Efficiency</CardTitle>
              <CardDescription>Analysis of staff utilization by role</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffingEfficiencyTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeoff" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Off Analysis</CardTitle>
              <CardDescription>Patterns and trends in time off requests</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Time off analytics coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
