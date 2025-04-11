
import React from 'react';
import { Clock } from 'lucide-react';

export const UpcomingShifts = () => {
  const shifts = [
    { 
      id: 1, 
      employee: 'Sarah Johnson', 
      role: 'Cashier', 
      date: 'Today', 
      time: '9:00 AM - 5:00 PM',
      status: 'Checked In'
    },
    { 
      id: 2, 
      employee: 'Michael Chen', 
      role: 'Sales Associate', 
      date: 'Today', 
      time: '10:00 AM - 6:00 PM',
      status: 'Checked In'
    },
    { 
      id: 3, 
      employee: 'James Wilson', 
      role: 'Manager', 
      date: 'Today', 
      time: '8:00 AM - 4:00 PM',
      status: 'Checked In'
    },
    { 
      id: 4, 
      employee: 'Emily Rodriguez', 
      role: 'Customer Service', 
      date: 'Tomorrow', 
      time: '9:00 AM - 5:00 PM',
      status: 'Scheduled'
    },
    { 
      id: 5, 
      employee: 'Robert Davis', 
      role: 'Inventory', 
      date: 'Tomorrow', 
      time: '7:00 AM - 3:00 PM',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <div 
          key={shift.id} 
          className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-workwise-blue flex items-center justify-center text-white text-sm font-medium">
              {shift.employee.split(' ').map(name => name[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-sm">{shift.employee}</p>
              <p className="text-xs text-muted-foreground">{shift.role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>{shift.time}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              shift.status === 'Checked In' 
                ? 'bg-workwise-green/10 text-workwise-green' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {shift.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
