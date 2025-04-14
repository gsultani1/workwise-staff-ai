
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
import { useStaffContext } from '@/contexts/StaffContext';

interface StaffListProps {
  readOnly?: boolean;
}

export const StaffList = ({ readOnly = false }: StaffListProps) => {
  const { filteredEmployees } = useStaffContext();
  
  const getStatusColor = (status: string = 'Active') => {
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
      {filteredEmployees.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Position</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Department</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Hire Date</th>
              {!readOnly && (
                <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-workwise-blue flex items-center justify-center text-white text-sm font-medium">
                      {`${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`}
                    </div>
                    <div>
                      <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{employee.jobPosition}</td>
                <td className="py-3 px-4 text-sm">{employee.department}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={getStatusColor(employee.status)}>
                    {employee.status || 'Active'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm">{employee.hireDate || 'N/A'}</td>
                {!readOnly && (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
