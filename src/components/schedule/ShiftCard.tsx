
import React from 'react';
import { cn } from '@/lib/utils';
import type { Shift } from '@/hooks/useShifts';

interface ShiftCardProps {
  shift: Shift;
  readOnly?: boolean;
  onDragStart: (e: React.DragEvent, shiftId: number | string) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ shift, readOnly, onDragStart }) => {
  return (
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
      onDragStart={(e) => onDragStart(e, shift.id)}
    >
      <div className="font-medium">{shift.employee}</div>
      <div className="text-[10px] opacity-90">{shift.role}</div>
      <div className="text-[10px] opacity-90">
        {shift.startTime}{shift.endTime ? ` - ${shift.endTime}` : ''}
      </div>
    </div>
  );
};
