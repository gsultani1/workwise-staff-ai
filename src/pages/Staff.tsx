
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffList } from '@/components/StaffList';
import { UserManagement } from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffContext } from '@/contexts/StaffContext';
import { SearchBar } from '@/components/SearchBar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Staff = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const { isAdmin, isManager } = useAuth();
  const { loading } = useStaffContext();

  // Role-specific UI elements
  const renderRoleBadge = () => {
    if (isAdmin) {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Admin View
        </div>
      );
    }
    if (isManager) {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Manager View
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Employee View
      </div>
    );
  };

  // If the user is an employee (not admin or manager), show limited access view
  if (!isAdmin && !isManager) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
            <p className="text-muted-foreground">View your team members.</p>
            {renderRoleBadge()}
          </div>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Access</AlertTitle>
          <AlertDescription>
            As an employee, you can view the staff directory but cannot make changes.
          </AlertDescription>
        </Alert>
        
        <Card className="border-border">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-lg text-muted-foreground">Loading employees...</div>
            </div>
          ) : (
            <StaffList readOnly={true} />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">Manage your team members and their access levels.</p>
          {renderRoleBadge()}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchBar />
          </div>
          {isAdmin && (
            <Button className="bg-workwise-blue hover:bg-workwise-blue/90 whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </div>
      </div>
      
      {isManager && !isAdmin && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle>Manager Access</AlertTitle>
          <AlertDescription>
            As a manager, you can view and manage staff information, but only administrators can change user roles.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="directory" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Access Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="directory" className="mt-4">
          <Card className="border-border">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-lg text-muted-foreground">Loading employees...</div>
              </div>
            ) : (
              <StaffList readOnly={!isAdmin && !isManager} />
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
