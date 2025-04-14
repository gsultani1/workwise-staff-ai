import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/employee';

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleChecks, setRoleChecks] = useState({
    admin: false,
    manager: false,
    employee: true
  });
  
  const { isAdmin } = useAuth();

  // Fetch all users and their roles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Query the staff_details view which joins profiles, employees, and roles
      const { data: staffDetails, error: staffError } = await supabase
        .from('staff_details')
        .select('*');
      
      if (staffError) throw staffError;

      // Transform the data to match our UserProfile type
      const usersWithRoles: UserProfile[] = staffDetails.map(staff => ({
        id: staff.user_id || '',
        first_name: staff.first_name || null,
        last_name: staff.last_name || null,
        email: staff.email || null,
        employee_id: staff.employee_id || '',
        roles: staff.roles || [],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setRoleChecks({
      admin: user.roles.includes('admin'),
      manager: user.roles.includes('manager'),
      employee: user.roles.includes('employee')
    });
    setDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      // First, delete all existing roles for the user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);
      
      if (deleteError) throw deleteError;

      // Then insert the new roles
      const newRoles = [];
      if (roleChecks.admin) newRoles.push({ user_id: selectedUser.id, role: 'admin' });
      if (roleChecks.manager) newRoles.push({ user_id: selectedUser.id, role: 'manager' });
      if (roleChecks.employee) newRoles.push({ user_id: selectedUser.id, role: 'employee' });
      
      // Ensure at least one role is assigned
      if (newRoles.length === 0) {
        newRoles.push({ user_id: selectedUser.id, role: 'employee' });
      }

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(newRoles);
      
      if (insertError) throw insertError;

      toast({
        title: 'Roles updated',
        description: `Roles for ${selectedUser.first_name} ${selectedUser.last_name} have been updated.`,
      });

      // Refresh the user list
      fetchUsers();
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating roles:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update roles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Only admins can manage roles
  if (!isAdmin) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Only administrators can manage user roles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Role Management</h2>
      </div>
      
      {loading && users.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Roles</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 px-4">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="space-x-2">
                      {user.roles.includes('admin') && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Admin
                        </span>
                      )}
                      {user.roles.includes('manager') && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Manager
                        </span>
                      )}
                      {user.roles.includes('employee') && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Employee
                        </span>
                      )}
                      {user.roles.length === 0 && (
                        <span className="text-muted-foreground">No roles</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                      Edit Roles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>
              {selectedUser && `Update roles for ${selectedUser.first_name} ${selectedUser.last_name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-role" className="flex items-center space-x-2">
                <Checkbox 
                  id="admin-role" 
                  checked={roleChecks.admin} 
                  onCheckedChange={(checked) => setRoleChecks({...roleChecks, admin: !!checked})}
                />
                <span>Administrator</span>
                <span className="text-xs text-muted-foreground ml-2">
                  (Full access to all system features)
                </span>
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager-role" className="flex items-center space-x-2">
                <Checkbox 
                  id="manager-role" 
                  checked={roleChecks.manager} 
                  onCheckedChange={(checked) => setRoleChecks({...roleChecks, manager: !!checked})}
                />
                <span>Manager</span>
                <span className="text-xs text-muted-foreground ml-2">
                  (Can manage staff, schedules, and approve requests)
                </span>
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employee-role" className="flex items-center space-x-2">
                <Checkbox 
                  id="employee-role" 
                  checked={roleChecks.employee} 
                  onCheckedChange={(checked) => setRoleChecks({...roleChecks, employee: !!checked})}
                />
                <span>Employee</span>
                <span className="text-xs text-muted-foreground ml-2">
                  (Basic access to personal dashboard and schedule)
                </span>
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
