
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useShiftHistory = () => {
  const { user } = useAuth();

  const recordShiftChange = async (shiftId: string | number, action: string, changes: any) => {
    if (!user) return;

    try {
      const { error: historyError } = await supabase
        .from('shift_history')
        .insert({
          shift_id: shiftId.toString(),
          modified_by: user.id,
          action,
          changes
        });
        
      if (historyError) {
        console.error('Error recording shift history:', historyError);
      }
    } catch (err) {
      console.error('Error in recordShiftChange:', err);
    }
  };

  return { recordShiftChange };
};
