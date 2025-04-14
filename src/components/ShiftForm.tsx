
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
  const { loading } = useStaffContext();
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

  if (loading) {
    return <div className="py-4 text-center">Loading employee data...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <FormControl>
                <EmployeeSelect value={field.value} onChange={field.onChange} />
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
              <FormLabel>Shift Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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
