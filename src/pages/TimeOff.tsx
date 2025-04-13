
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeOffRequestForm } from '@/components/TimeOffRequestForm';
import { TimeOffRequests } from '@/components/TimeOffRequests';
import { Badge } from '@/components/ui/badge';

const TimeOff = () => {
  // Track active tab for better user experience
  const [activeTab, setActiveTab] = useState('pending');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Time Off Requests</h1>
        <p className="text-muted-foreground">Manage time off requests for your team.</p>
      </div>
      
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
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
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>View all approved and denied time off requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="py-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-medium">Robert Davis</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-workwise-blue/10 hover:bg-workwise-blue/20 text-workwise-blue">
                          Vacation
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Approved
                        </Badge>
                      </div>
                      <p className="text-sm">
                        Date Range: 03/15/2025 - 03/20/2025
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="py-4 border-t">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-medium">Maria Garcia</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-workwise-blue/10 hover:bg-workwise-blue/20 text-workwise-blue">
                          Sick Leave
                        </Badge>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          Denied
                        </Badge>
                      </div>
                      <p className="text-sm">
                        Date: 03/25/2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
