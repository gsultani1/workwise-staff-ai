
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { employees, loading } = useStaffContext();
  
  const employeesList = Array.isArray(employees) ? employees : [];
  const selectedEmployee = employeesList.find((employee) => employee?.id === value);
  const displayValue = selectedEmployee 
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` 
    : 'Select employee...';

  // Filter employees based on search query
  const filteredEmployees = employeesList
    .filter(Boolean)
    .filter(employee => {
      if (!searchQuery) return true;
      
      const fullName = `${employee.firstName} ${employee.lastName} ${employee.jobPosition}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
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
          type="button"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-3 z-50">
        {loading ? (
          <div className="py-6 text-center text-sm">Loading employees...</div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {/* Custom search input */}
            <div className="flex items-center border-b px-3 mb-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search employee..."
                className="h-9 px-0 border-none focus:ring-0 text-sm flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Empty state */}
            {filteredEmployees.length === 0 && (
              <div className="py-6 text-center text-sm">No employee found.</div>
            )}
            
            {/* Employee list */}
            <div className="p-1">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeSelect(employee.id)}
                  className={cn(
                    "flex items-center py-1.5 px-2 text-sm rounded-md",
                    "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    value === employee.id && "bg-accent text-accent-foreground"
                  )}
                  role="option"
                  aria-selected={value === employee.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEmployeeSelect(employee.id);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === employee.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{employee.firstName} {employee.lastName} - {employee.jobPosition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
