
import { useState, useEffect } from 'react';
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
  const { user } = useAuth();

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

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

  const updateShiftDay = async (shiftId: string | number, newDay: number) => {
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

  useEffect(() => {
    fetchShifts();
  }, [currentDate]);

  return {
    shifts,
    loading,
    updateShiftDay,
    setShifts
  };
};
