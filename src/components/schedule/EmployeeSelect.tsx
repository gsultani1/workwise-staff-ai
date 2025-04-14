
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);
  
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
    setSearchQuery('');
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
      <PopoverContent className="w-full p-0" style={{ zIndex: 50 }}>
        <div className="max-h-[300px] overflow-y-auto">
          {/* Search input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={searchInputRef}
              placeholder="Search employee..."
              className="h-9 px-0 border-none focus-visible:ring-0 focus:ring-0 text-sm flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="employee-search"
              aria-label="Search for an employee"
            />
          </div>
          
          {/* Loading state */}
          {loading ? (
            <div className="py-6 text-center text-sm">Loading employees...</div>
          ) : (
            <>
              {/* Empty state */}
              {filteredEmployees.length === 0 && (
                <div className="py-6 text-center text-sm">No employee found.</div>
              )}
              
              {/* Employee list */}
              <div className="p-2">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      value === employee.id && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleEmployeeSelect(employee.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEmployeeSelect(employee.id);
                      }
                    }}
                    role="option"
                    aria-selected={value === employee.id}
                    tabIndex={0}
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === employee.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                        <div className="text-xs text-muted-foreground">{employee.jobPosition}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
