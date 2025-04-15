
import React from 'react';
import { cn } from '@/lib/utils';
import { ShiftCard } from './ShiftCard';
import type { Shift } from '@/hooks/useShifts';

interface CalendarDayProps {
  day: Date;
  shifts: Shift[];
  isToday: boolean;
  readOnly?: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dayIndex: number) => void;
  onDragStart: (e: React.DragEvent, shiftId: number | string) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  shifts,
  isToday,
  readOnly,
  onDragOver,
  onDrop,
  onDragStart,
}) => {
  return (
    <div 
      className={cn(
        "calendar-day p-2",
        isToday && "bg-blue-50"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day.getDay())}
    >
      <div className="calendar-day-header flex justify-between items-center">
        <span className={cn(
          isToday && "font-bold text-workwise-blue"
        )}>
          {day.getDate()}
        </span>
        {shifts.length > 0 && 
          <span className="text-xs bg-workwise-blue/10 text-workwise-blue px-1 rounded-sm">
            {shifts.length} shifts
          </span>
        }
      </div>
      
      <div className="mt-1">
        {shifts.map(shift => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            readOnly={readOnly}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
