
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const ShiftEntry = () => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: 'shifts',
    control: form.control,
  });

  return (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 p-4 border rounded-lg relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>

          <FormField
            control={form.control}
            name={`shifts.${index}.day`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`shifts.${index}.startTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`shifts.${index}.endTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({ day: 0, startTime: "09:00", endTime: "17:00" })}
      >
        Add Another Shift
      </Button>
    </div>
  );
};
