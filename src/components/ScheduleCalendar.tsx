
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { CalendarDay } from './schedule/CalendarDay';
import { useShifts } from '@/hooks/useShifts';

interface ScheduleCalendarProps {
  currentDate: Date;
  readOnly?: boolean;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ currentDate, readOnly = false }) => {
  const { shifts, loading, updateShiftDay, setShifts } = useShifts(currentDate);
  
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

  const getShiftsForDay = (dayIndex: number) => {
    return shifts.filter(shift => shift.day === dayIndex);
  };

  const handleDragStart = (e: React.DragEvent, shiftId: number | string) => {
    if (readOnly) return;
    e.dataTransfer.setData('shiftId', shiftId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetDayIndex: number) => {
    if (readOnly) return;
    
    e.preventDefault();
    const shiftId = e.dataTransfer.getData('shiftId');
    
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id.toString() === shiftId 
          ? { ...shift, day: targetDayIndex }
          : shift
      )
    );

    await updateShiftDay(shiftId, targetDayIndex);

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
          <CalendarDay
            key={index}
            day={day}
            shifts={getShiftsForDay(day.getDay())}
            isToday={isToday(day)}
            readOnly={readOnly}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};
