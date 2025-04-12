
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ScheduleCalendarProps {
  currentDate: Date;
}

interface Shift {
  id: number;
  employee: string;
  role: string;
  day: number;
  startTime: string;
  endTime: string;
  type: 'shift' | 'time-off' | 'training';
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ currentDate }) => {
  // Generate days for the week starting with the first day of the week (Sunday)
  const getDaysInWeek = () => {
    const days = [];
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear();
  };
  
  const days = getDaysInWeek();
  
  // Mock shift data as state to allow modifications
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      employee: 'Sarah Johnson',
      role: 'Cashier',
      day: new Date().getDay(), // Today
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      type: 'shift'
    },
    {
      id: 2,
      employee: 'Michael Chen',
      role: 'Sales Associate',
      day: new Date().getDay(), // Today
      startTime: '10:00 AM',
      endTime: '6:00 PM',
      type: 'shift'
    },
    {
      id: 3,
      employee: 'James Wilson',
      role: 'Manager',
      day: new Date().getDay(), // Today
      startTime: '8:00 AM',
      endTime: '4:00 PM',
      type: 'shift'
    },
    {
      id: 4,
      employee: 'Emily Rodriguez',
      role: 'Customer Service',
      day: (new Date().getDay() + 1) % 7, // Tomorrow
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      type: 'shift'
    },
    {
      id: 5,
      employee: 'Robert Davis',
      role: 'Time Off',
      day: (new Date().getDay() + 2) % 7, // Day after tomorrow
      startTime: 'All Day',
      endTime: '',
      type: 'time-off'
    },
    {
      id: 6,
      employee: 'Lisa Kim',
      role: 'Training',
      day: (new Date().getDay() + 3) % 7,
      startTime: '1:00 PM',
      endTime: '5:00 PM',
      type: 'training'
    }
  ]);
  
  const getShiftsForDay = (dayIndex: number) => {
    return shifts.filter(shift => shift.day === dayIndex);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, shiftId: number) => {
    e.dataTransfer.setData('shiftId', shiftId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetDayIndex: number) => {
    e.preventDefault();
    const shiftId = parseInt(e.dataTransfer.getData('shiftId'));
    
    // Update the shift day
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === shiftId 
          ? { ...shift, day: targetDayIndex }
          : shift
      )
    );

    // Show success notification
    toast({
      title: "Shift moved",
      description: "The shift has been successfully rescheduled.",
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className="p-3 text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ minHeight: '600px' }}>
        {days.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "calendar-day p-2",
              isToday(day) && "bg-blue-50"
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, day.getDay())}
          >
            <div className="calendar-day-header flex justify-between items-center">
              <span className={cn(
                isToday(day) && "font-bold text-workwise-blue"
              )}>
                {day.getDate()}
              </span>
              {getShiftsForDay(day.getDay()).length > 0 && 
                <span className="text-xs bg-workwise-blue/10 text-workwise-blue px-1 rounded-sm">
                  {getShiftsForDay(day.getDay()).length} shifts
                </span>
              }
            </div>
            
            <div className="mt-1">
              {getShiftsForDay(day.getDay()).map(shift => (
                <div 
                  key={shift.id} 
                  className={cn(
                    "calendar-event mb-2 p-2 rounded-md text-sm border cursor-move",
                    shift.type === 'shift' && "bg-workwise-blue/10 border-workwise-blue/20",
                    shift.type === 'time-off' && "bg-workwise-green/10 border-workwise-green/20",
                    shift.type === 'training' && "bg-amber-50 border-amber-200"
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, shift.id)}
                >
                  <div className="font-medium">{shift.employee}</div>
                  <div className="text-[10px] opacity-90">{shift.role}</div>
                  <div className="text-[10px] opacity-90">
                    {shift.startTime}{shift.endTime ? ` - ${shift.endTime}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
