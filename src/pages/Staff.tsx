import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffList } from '@/components/StaffList';
import { UserManagement } from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { StaffProvider, useStaffContext } from '@/contexts/StaffContext';

const StaffContent = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { isAdmin } = useAuth();
  const { setEmployees, setFilteredEmployees } = useStaffContext();

  // In a real app, replace this with an actual API call to fetch employees
  useEffect(() => {
    const mockEmployees = [
      { 
        id: '1', 
        firstName: 'Sarah', 
        lastName: 'Johnson', 
        email: 'sarah.j@example.com', 
        department: 'Sales', 
        role: 'Cashier' 
      },
      // Add more mock employees
    ];
    
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, [setEmployees, setFilteredEmployees]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">Manage your team members and their roles.</p>
        </div>
        <Button className="bg-workwise-blue hover:bg-workwise-blue/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      <Tabs defaultValue="directory" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Role Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="directory" className="mt-4">
          <Card className="border-border">
            <div className="border-b border-border p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                </div>
                <Button variant="outline">
                </Button>
              </div>
            </div>
            
            <StaffList />
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="roles" className="mt-4">
            <Card className="border-border p-6">
              <UserManagement />
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const Staff = () => {
  return (
    <StaffProvider>
      <StaffContent />
    </StaffProvider>
  );
};

export default Staff;
