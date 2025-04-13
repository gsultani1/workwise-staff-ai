
import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';

export const UpcomingShifts = () => {
  const [expandedShifts, setExpandedShifts] = useState<number[]>([]);

  const shifts = [
    { 
      id: 1, 
      employee: 'Sarah Johnson', 
      role: 'Cashier', 
      date: 'Today', 
      time: '9:00 AM - 5:00 PM',
      status: 'Checked In',
      location: 'Main Store - Register 3',
      contact: '+1 (555) 123-4567',
      notes: 'Covering for Mike who is on vacation'
    },
    { 
      id: 2, 
      employee: 'Michael Chen', 
      role: 'Sales Associate', 
      date: 'Today', 
      time: '10:00 AM - 6:00 PM',
      status: 'Checked In',
      location: 'Main Store - Electronics Dept',
      contact: '+1 (555) 987-6543',
      notes: 'Training new hire from 2-4 PM'
    },
    { 
      id: 3, 
      employee: 'James Wilson', 
      role: 'Manager', 
      date: 'Today', 
      time: '8:00 AM - 4:00 PM',
      status: 'Checked In',
      location: 'Main Store - Office',
      contact: '+1 (555) 456-7890',
      notes: 'Inventory audit scheduled for 1 PM'
    },
    { 
      id: 4, 
      employee: 'Emily Rodriguez', 
      role: 'Customer Service', 
      date: 'Tomorrow', 
      time: '9:00 AM - 5:00 PM',
      status: 'Scheduled',
      location: 'Main Store - Customer Service Desk',
      contact: '+1 (555) 234-5678',
      notes: ''
    },
    { 
      id: 5, 
      employee: 'Robert Davis', 
      role: 'Inventory', 
      date: 'Tomorrow', 
      time: '7:00 AM - 3:00 PM',
      status: 'Scheduled',
      location: 'Warehouse',
      contact: '+1 (555) 345-6789',
      notes: 'New shipment arriving at 10 AM'
    }
  ];

  const toggleShift = (id: number) => {
    setExpandedShifts(prev => 
      prev.includes(id) 
        ? prev.filter(shiftId => shiftId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <Collapsible 
          key={shift.id} 
          open={expandedShifts.includes(shift.id)}
          onOpenChange={() => toggleShift(shift.id)}
          className="rounded-md border border-border hover:bg-muted/50 transition-colors"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer">
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
              {expandedShifts.includes(shift.id) ? (
                <ChevronUp className="h-4 w-4 ml-2 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-3 pt-1 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{shift.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{shift.contact}</span>
                </div>
              </div>
              {shift.notes && (
                <div className="mt-2">
                  <p className="text-xs font-medium">Notes:</p>
                  <p className="text-sm">{shift.notes}</p>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline">Message</Button>
                {shift.status !== 'Checked In' && (
                  <Button size="sm" variant="default">Check In</Button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};
