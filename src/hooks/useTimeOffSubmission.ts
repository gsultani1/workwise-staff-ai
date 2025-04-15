
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EmployeeData {
  id: string;
  first_name: string;
  last_name: string;
}

export interface TimeOffFormData {
  startDate?: Date;
  endDate?: Date;
  requestType: string;
  reason: string;
}

export const useTimeOffSubmission = () => {
  const [submitting, setSubmitting] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('employee_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('id, first_name, last_name')
          .eq('id', profileData.employee_id)
          .single();
        
        if (employeeError) throw employeeError;
        
        setEmployeeData(employeeData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    
    fetchEmployeeData();
  }, [user]);

  const handleSubmit = async (formData: TimeOffFormData) => {
    const { startDate, endDate, requestType, reason } = formData;
    
    if (!startDate || !endDate) {
      toast({
        title: 'Missing dates',
        description: 'Please select both start and end dates.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user || !employeeData) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to submit time off requests.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('time_off_requests')
        .insert({
          // Remove user_id from the insert
          employee_id: employeeData.id,
          type: requestType.charAt(0).toUpperCase() + requestType.slice(1),
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          reason: reason || null
        });
      
      if (error) throw error;
      
      toast({
        title: 'Request Submitted',
        description: 'Your time off request has been submitted for approval.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error submitting time off request:', error);
      toast({
        title: 'Submission failed',
        description: error.message || 'There was an error submitting your request.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    employeeData,
    handleSubmit
  };
};
