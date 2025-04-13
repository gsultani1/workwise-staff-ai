
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffList } from '@/components/StaffList';
import { UserManagement } from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffContext } from '@/contexts/StaffContext';
import { SearchBar } from '@/components/SearchBar';

const Staff = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { isAdmin } = useAuth();
  const { loading } = useStaffContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">Manage your team members and their roles.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchBar />
          </div>
          <Button className="bg-workwise-blue hover:bg-workwise-blue/90 whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="directory" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Role Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="directory" className="mt-4">
          <Card className="border-border">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-lg text-muted-foreground">Loading employees...</div>
              </div>
            ) : (
              <StaffList />
            )}
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

export default Staff;
