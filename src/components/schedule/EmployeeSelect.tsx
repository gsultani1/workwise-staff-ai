
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
  CommandList,
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
  
  const employeesList = Array.isArray(employees) ? employees : [];
  const selectedEmployee = employeesList.find((employee) => employee?.id === value);
  const displayValue = selectedEmployee 
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` 
    : 'Select employee...';

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
            <CommandList>
              {employeesList.length === 0 ? (
                <CommandEmpty>No employees available.</CommandEmpty>
              ) : (
                <>
                  <CommandEmpty>No employee found.</CommandEmpty>
                  <CommandGroup>
                    {employeesList.filter(Boolean).map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={employee.id}
                        onSelect={(currentValue) => {
                          if (typeof currentValue === 'string') {
                            onChange(currentValue);
                          } else {
                            onChange(employee.id);
                          }
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === employee.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {employee.firstName} {employee.lastName} - {employee.jobPosition}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
