
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Employee } from '@/types/employee';
import { useStaffContext } from '@/contexts/StaffContext';

interface EmployeeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmployeeSelect = ({ value, onChange }: EmployeeSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const { employees, loading } = useStaffContext();
  
  // Ensure employees is always a valid array
  const employeesList = Array.isArray(employees) ? employees : [];
  
  const selectedEmployee = employeesList.find((employee) => employee?.id === value);
  const displayValue = selectedEmployee 
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` 
    : 'Select employee...';

  console.log('EmployeeSelect - employees:', employeesList.length, 'loading:', loading);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {loading ? (
          <div className="py-6 text-center text-sm">Loading employees...</div>
        ) : (
          <Command>
            <CommandInput placeholder="Search employee..." />
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {employeesList.length > 0 ? (
                employeesList.map((employee) => (
                  employee && (
                    <CommandItem
                      key={employee.id}
                      value={employee.id}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === employee.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {employee.firstName} {employee.lastName} - {employee.jobPosition}
                    </CommandItem>
                  )
                ))
              ) : (
                <div className="py-6 text-center text-sm">No employees available.</div>
              )}
            </CommandGroup>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
