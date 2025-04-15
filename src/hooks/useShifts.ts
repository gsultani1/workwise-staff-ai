
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Shift {
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

export const useShifts = (currentDate: Date) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    
    try {
      const timeParts = time.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      
      if (isNaN(hours)) {
        return '';
      }
      
      const suffix = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      return `${displayHour}:${minutes} ${suffix}`;
    } catch (err) {
      console.error('Error formatting time:', err, time);
      return '';
    }
  };

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
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

      if (fetchError) {
        throw fetchError;
      }

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
    } catch (err) {
      const error = err as Error;
      console.error('Error in fetchShifts:', error);
      setError(error);
      toast({
        title: "Error",
        description: "Failed to load shifts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShiftDay = async (shiftId: string | number, newDay: number) => {
    try {
      // Update the UI optimistically
      setShifts(prevShifts => 
        prevShifts.map(shift => 
          shift.id.toString() === shiftId.toString() 
            ? { ...shift, day: newDay }
            : shift
        )
      );

      // Then update the database
      const { error: updateError } = await supabase
        .from('shifts')
        .update({ day: newDay })
        .eq('id', shiftId.toString());

      if (updateError) {
        throw updateError;
      }
      
      // Record the shift change in history if user is authenticated
      if (user) {
        const { error: historyError } = await supabase
          .from('shift_history')
          .insert({
            shift_id: shiftId.toString(),
            modified_by: user.id,
            action: 'day_changed',
            changes: { new_day: newDay }
          });
          
        if (historyError) {
          console.error('Error recording shift history:', historyError);
          // Don't throw here - we don't want to fail the whole operation
          // just because history recording failed
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error in updateShiftDay:', error);
      
      // Rollback optimistic update if there was an error
      fetchShifts();
      
      toast({
        title: "Error",
        description: "Failed to update shift. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteShift = async (shiftId: string | number) => {
    try {
      // Update UI optimistically
      setShifts(prevShifts => 
        prevShifts.filter(shift => shift.id.toString() !== shiftId.toString())
      );
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId.toString());
        
      if (deleteError) {
        throw deleteError;
      }
      
      toast({
        title: "Success",
        description: "Shift has been deleted.",
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error in deleteShift:', error);
      
      // Rollback optimistic update
      fetchShifts();
      
      toast({
        title: "Error",
        description: "Failed to delete shift. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [currentDate, fetchShifts]);

  return {
    shifts,
    loading,
    error,
    updateShiftDay,
    deleteShift,
    setShifts,
    fetchShifts
  };
};
