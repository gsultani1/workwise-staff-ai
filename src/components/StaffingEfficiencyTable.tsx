
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const StaffingEfficiencyTable = () => {
  const staffingData = [
    { 
      role: 'Cashier', 
      utilization: 92,
      trend: 'up',
      optimal: 6,
      actual: 5,
      status: 'Understaffed'
    },
    { 
      role: 'Sales Associate', 
      utilization: 87,
      trend: 'up',
      optimal: 8,
      actual: 8,
      status: 'Optimal'
    },
    { 
      role: 'Manager', 
      utilization: 95,
      trend: 'up',
      optimal: 2,
      actual: 2,
      status: 'Optimal'
    },
    { 
      role: 'Customer Service', 
      utilization: 78,
      trend: 'down',
      optimal: 3,
      actual: 4,
      status: 'Overstaffed'
    },
    { 
      role: 'Inventory Specialist', 
      utilization: 90,
      trend: 'same',
      optimal: 2,
      actual: 2,
      status: 'Optimal'
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Understaffed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Optimal':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Overstaffed':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Utilization</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Optimal Staffing</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Actual Staffing</th>
            <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {staffingData.map((item) => (
            <tr key={item.role} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4 text-sm font-medium">{item.role}</td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Progress value={item.utilization} className="h-2 w-24" />
                  <span className="text-sm">{item.utilization}%</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{item.optimal}</td>
              <td className="py-3 px-4 text-sm">{item.actual}</td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
