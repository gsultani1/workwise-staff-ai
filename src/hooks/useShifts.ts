import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatTimeDisplay } from '@/utils/timeFormatter';
import { useShiftOperations } from './useShiftOperations';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const { shifts, setShifts, updateShiftDay, deleteShift } = useShiftOperations(fetchShifts);

  // Fetch shifts when currentDate changes
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
