
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffList } from '@/components/StaffList';
import { UserManagement } from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';

const Staff = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { isAdmin } = useAuth();
  
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
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="w-full pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
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

export default Staff;
