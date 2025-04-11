
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const StaffList = () => {
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Cashier',
      status: 'Active',
      department: 'Front End',
      hireDate: '01/15/2023'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'Sales Associate',
      status: 'Active',
      department: 'Sales Floor',
      hireDate: '03/22/2022'
    },
    {
      id: 3,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'Manager',
      status: 'Active',
      department: 'Management',
      hireDate: '05/10/2020'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'Customer Service',
      status: 'On Leave',
      department: 'Customer Service',
      hireDate: '11/03/2021'
    },
    {
      id: 5,
      name: 'Robert Davis',
      email: 'robert.davis@example.com',
      role: 'Inventory Specialist',
      status: 'Active',
      department: 'Warehouse',
      hireDate: '08/17/2022'
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'On Leave':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Hire Date</th>
            <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-workwise-blue flex items-center justify-center text-white text-sm font-medium">
                    {employee.name.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{employee.role}</td>
              <td className="py-3 px-4 text-sm">{employee.department}</td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">{employee.hireDate}</td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Schedule</DropdownMenuItem>
                    <DropdownMenuItem>Time Off</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
