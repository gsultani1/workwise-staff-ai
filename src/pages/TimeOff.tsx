
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeOffRequestForm } from '@/components/TimeOffRequestForm';
import { TimeOffRequests } from '@/components/TimeOffRequests';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface TimeOffHistory {
  id: string;
  employee_name: string;
  type: string;
  start_date: string;
  end_date: string;
  status: 'approved' | 'denied';
}

const TimeOff = () => {
  // Track active tab for better user experience
  const [activeTab, setActiveTab] = useState('pending');
  const [historyItems, setHistoryItems] = useState<TimeOffHistory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch history items when the history tab is selected
  useEffect(() => {
    if (activeTab === 'history') {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('time_off_requests')
            .select('*')
            .or('status.eq.approved,status.eq.denied')
            .order('updated_at', { ascending: false });
          
          if (error) throw error;
          
          if (data) {
            setHistoryItems(data as TimeOffHistory[]);
          }
        } catch (error) {
          console.error('Error fetching time off history:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchHistory();
    }
  }, [activeTab]);
  
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
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">Loading history...</div>
              ) : historyItems.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No request history found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyItems.map((item, index) => (
                    <div key={item.id} className={`py-4 ${index > 0 ? 'border-t' : ''}`}>
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-medium">{item.employee_name}</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-workwise-blue/10 hover:bg-workwise-blue/20 text-workwise-blue">
                              {item.type}
                            </Badge>
                            <Badge variant="outline" className={`
                              ${item.status === 'approved' 
                                ? 'bg-green-100 text-green-800 border-green-300' 
                                : 'bg-red-100 text-red-800 border-red-300'
                              }
                            `}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {item.start_date === item.end_date 
                              ? `Date: ${item.start_date}` 
                              : `Date Range: ${item.start_date} - ${item.end_date}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
