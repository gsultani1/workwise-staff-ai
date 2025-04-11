
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeOffRequestForm } from '@/components/TimeOffRequestForm';
import { TimeOffRequests } from '@/components/TimeOffRequests';

const TimeOff = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Time Off Requests</h1>
        <p className="text-muted-foreground">Manage time off requests for your team.</p>
      </div>
      
      <Tabs defaultValue="requests">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Time Off Requests</CardTitle>
              <CardDescription>Review and manage time off requests from your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeOffRequests />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>New Time Off Request</CardTitle>
              <CardDescription>Submit a new time off request for approval.</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeOffRequestForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeOff;
