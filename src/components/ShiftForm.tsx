
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmployeeSelect } from './schedule/EmployeeSelect';
import { ShiftEntry } from './schedule/ShiftEntry';
import { useStaffContext } from '@/contexts/StaffContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ShiftFormValues {
  employeeId: string;
  type: 'shift' | 'time-off' | 'training';
  shifts: Array<{
    day: number;
    startTime: string;
    endTime: string;
  }>;
}

interface ShiftFormProps {
  onSubmit: (data: ShiftFormValues) => void;
  onCancel: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ onSubmit, onCancel }) => {
  const { loading, employees } = useStaffContext();
  const { user } = useAuth();
  const form = useForm<ShiftFormValues>({
    defaultValues: {
      employeeId: '',
      type: 'shift',
      shifts: [
        {
          day: new Date().getDay(),
          startTime: '09:00',
          endTime: '17:00',
        },
      ],
    },
  });

  console.log('ShiftForm - employees:', employees?.length || 0, 'loading:', loading);

  if (loading) {
    return <div className="py-4 text-center">Loading employee data...</div>;
  }

  if (!employees || employees.length === 0) {
    return <div className="py-4 text-center">No employees available. Please add employees first.</div>;
  }

  // Submit handler that will save to database
  const handleFormSubmit = async (data: ShiftFormValues) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      // For each shift in the form, insert into database
      const savedShifts = await Promise.all(
        data.shifts.map(async (shift) => {
          const { data: savedShift, error } = await supabase
            .from('shifts')
            .insert({
              employee_id: data.employeeId,
              created_by: user.id,
              type: data.type,
              day: shift.day,
              start_time: shift.startTime,
              end_time: data.type === 'time-off' ? null : shift.endTime
            })
            .select()
            .single();

          if (error) {
            console.error('Error saving shift:', error);
            throw error;
          }

          return savedShift;
        })
      );

      console.log('Shifts saved successfully:', savedShifts);
      
      // Call the onSubmit callback with the form data
      onSubmit(data);
    } catch (error) {
      console.error('Error saving shifts:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="employee-select">Employee</FormLabel>
              <FormControl>
                <EmployeeSelect 
                  value={field.value} 
                  onChange={(value) => {
                    console.log('ShiftForm - Employee selected:', value);
                    field.onChange(value);
                  }} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="shift-type">Shift Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="shift-type">
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="shift">Regular Shift</SelectItem>
                  <SelectItem value="time-off">Time Off</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ShiftEntry />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Shifts</Button>
        </div>
      </form>
    </Form>
  );
};
