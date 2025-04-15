
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useShiftHistory } from './useShiftHistory';
import type { Shift } from './useShifts';

export const useShiftOperations = (fetchShifts: () => Promise<void>) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const { recordShiftChange } = useShiftHistory();

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

      // Update the database
      const { error: updateError } = await supabase
        .from('shifts')
        .update({ day: newDay })
        .eq('id', shiftId.toString());

      if (updateError) {
        throw updateError;
      }
      
      await recordShiftChange(shiftId, 'day_changed', { new_day: newDay });
      
    } catch (err) {
      console.error('Error in updateShiftDay:', err);
      fetchShifts(); // Rollback optimistic update
      
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
      
      const { error: deleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId.toString());
        
      if (deleteError) {
        throw deleteError;
      }
      
      await recordShiftChange(shiftId, 'deleted', null);
      
      toast({
        title: "Success",
        description: "Shift has been deleted.",
      });
    } catch (err) {
      console.error('Error in deleteShift:', err);
      fetchShifts(); // Rollback optimistic update
      
      toast({
        title: "Error",
        description: "Failed to delete shift. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { shifts, setShifts, updateShiftDay, deleteShift };
};
