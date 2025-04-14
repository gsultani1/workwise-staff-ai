
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpcomingShifts } from '@/components/UpcomingShifts';
import { StaffingEfficiencyTable } from '@/components/StaffingEfficiencyTable';
import { useAuth } from '@/contexts/AuthContext';

export const ShiftsAndStaffingCard = () => {
  const [activeTab, setActiveTab] = useState('shifts');
  const { isAdmin, isManager } = useAuth();
  const hasManagementPrivileges = isAdmin || isManager;

  return (
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
  );
};
