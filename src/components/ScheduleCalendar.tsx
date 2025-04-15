
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ScheduleCalendarProps {
  currentDate: Date;
  readOnly?: boolean;
}

interface Shift {
  id: number | string;
  employee: string;
  role: string;
  day: number;
  startTime: string;
  endTime: string;
  type: 'shift' | 'time-off' | 'training';
}

interface DbShift {
  id: string;
  employee_id: string;
  created_by: string;
  type: 'shift' | 'time-off' | 'training';
  day: number;
  start_time: string;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  employees: {
    first_name: string;
    last_name: string;
    job_position: string;
  };
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ currentDate, readOnly = false }) => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // Fetch shifts from database
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          *,
          employees:employee_id (
            first_name,
            last_name,
            job_position
          )
        `)
        .order('day');

      if (error) {
        console.error('Error fetching shifts:', error);
        throw error;
      }

      // Convert the database shifts to our app format
      const formattedShifts: Shift[] = (data as DbShift[]).map(dbShift => ({
        id: dbShift.id,
        employee: `${dbShift.employees.first_name} ${dbShift.employees.last_name}`,
        role: dbShift.employees.job_position,
        day: dbShift.day,
        startTime: formatTimeDisplay(dbShift.start_time),
        endTime: dbShift.end_time ? formatTimeDisplay(dbShift.end_time) : '',
        type: dbShift.type
      }));

      setShifts(formattedShifts);
    } catch (error) {
      console.error('Error in fetchShifts:', error);
      toast({
        title: "Error",
        description: "Failed to load shifts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load shifts when component mounts or when currentDate changes
  useEffect(() => {
    fetchShifts();
  }, [currentDate]);

  // Function to format time for display
  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    
    // Handle both formats: '09:00' and '09:00:00'
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    
    return `${displayHour}:${minutes} ${suffix}`;
  };
  
  // Listen for new shifts from the Schedule component
  useEffect(() => {
    const handleAddShift = (event: Event) => {
      const customEvent = event as CustomEvent<Shift>;
      setShifts(prevShifts => [...prevShifts, customEvent.detail]);
      // Refetch shifts to ensure we have the latest data
      fetchShifts();
    };

    document.addEventListener('addShift', handleAddShift);
    
    return () => {
      document.removeEventListener('addShift', handleAddShift);
    };
  }, []);
  
  const getShiftsForDay = (dayIndex: number) => {
    return shifts.filter(shift => shift.day === dayIndex);
  };

  // Update shift in database when dragged
  const updateShiftDay = async (shiftId: number | string, newDay: number) => {
    try {
      const { error } = await supabase
        .from('shifts')
        .update({ day: newDay })
        .eq('id', shiftId);

      if (error) {
        console.error('Error updating shift:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateShiftDay:', error);
      toast({
        title: "Error",
        description: "Failed to update shift. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, shiftId: number | string) => {
    if (readOnly) return; // Prevent drag if readonly
    e.dataTransfer.setData('shiftId', shiftId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return; // Prevent dragover if readonly
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetDayIndex: number) => {
    if (readOnly) return; // Prevent drop if readonly
    
    e.preventDefault();
    const shiftId = e.dataTransfer.getData('shiftId');
    
    // Update the shift day in state
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id.toString() === shiftId 
          ? { ...shift, day: targetDayIndex }
          : shift
      )
    );

    // Update in database
    updateShiftDay(shiftId, targetDayIndex);

    // Show success notification
    toast({
      title: "Shift moved",
      description: "The shift has been successfully rescheduled.",
    });
  };

  if (loading && shifts.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="animate-pulse">Loading shifts...</div>
      </div>
    );
  }

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
                    "calendar-event mb-2 p-2 rounded-md text-sm border",
                    shift.type === 'shift' && "bg-workwise-blue/10 border-workwise-blue/20",
                    shift.type === 'time-off' && "bg-workwise-green/10 border-workwise-green/20",
                    shift.type === 'training' && "bg-amber-50 border-amber-200",
                    !readOnly && "cursor-move"
                  )}
                  draggable={!readOnly}
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
