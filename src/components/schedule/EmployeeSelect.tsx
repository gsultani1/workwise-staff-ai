
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

  // Create direct click handlers for each employee
  const handleEmployeeClick = (employeeId: string) => {
    onChange(employeeId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="employee-select"
          name="employee-select"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50">
        {loading ? (
          <div className="py-6 text-center text-sm">Loading employees...</div>
        ) : (
          <Command>
            <CommandInput placeholder="Search employee..." />
            <CommandList>
              <CommandEmpty>No employee found.</CommandEmpty>
              <CommandGroup>
                {employeesList.filter(Boolean).map((employee) => (
                  // Use a div with onClick for direct selection
                  <div 
                    key={employee.id}
                    className={cn(
                      "flex items-center px-2 py-1.5 text-sm relative cursor-pointer hover:bg-accent",
                      value === employee.id && "bg-accent"
                    )}
                    onClick={() => handleEmployeeClick(employee.id)}
                    role="option"
                    aria-selected={value === employee.id}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === employee.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {employee.firstName} {employee.lastName} - {employee.jobPosition}
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
