
import React from 'react';
import { CalendarDay } from './schedule/CalendarDay';
import { useShifts } from '@/hooks/useShifts';
import { ErrorBoundary } from './ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ScheduleCalendarProps {
  currentDate: Date;
  readOnly?: boolean;
}

const LoadingCalendar = () => (
  <div className="bg-card rounded-lg border border-border overflow-hidden">
    <div className="grid grid-cols-7 border-b border-border">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="p-3 text-center font-medium">
          {day}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7" style={{ minHeight: '600px' }}>
      {Array(7).fill(0).map((_, i) => (
        <div key={i} className="border-r border-b border-border p-2">
          <Skeleton className="h-6 w-6 rounded-full mb-2" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ currentDate, readOnly = false }) => {
  const { shifts, loading, error, updateShiftDay, setShifts } = useShifts(currentDate);
  
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load schedule: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <LoadingCalendar />;
  }

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
  };

  const days = getDaysInWeek();

  return (
    <ErrorBoundary>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
    </ErrorBoundary>
  );
};
