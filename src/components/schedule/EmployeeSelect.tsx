
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
  console.log('[EmployeeSelect] Component rendered with value:', value);
  
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { employees, loading } = useStaffContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    console.log('[EmployeeSelect] Popover state changed:', { open, searchQuery });
    
    if (open && searchInputRef.current) {
      console.log('[EmployeeSelect] Focusing search input');
      setTimeout(() => {
        searchInputRef.current?.focus();
        console.log('[EmployeeSelect] Search input focused');
      }, 100);
    } else {
      console.log('[EmployeeSelect] Closing popover, clearing search');
      setSearchQuery('');
    }
  }, [open]);
  
  // Monitor context data changes
  useEffect(() => {
    console.log('[EmployeeSelect] Context data updated:', {
      employeesCount: employees?.length || 0,
      loading
    });
  }, [employees, loading]);
  
  const employeesList = Array.isArray(employees) ? employees : [];
  const selectedEmployee = employeesList.find((employee) => employee?.id === value);
  
  console.log('[EmployeeSelect] Current state:', {
    employeesCount: employeesList.length,
    selectedEmployee,
    open,
    searchQuery
  });

  const filteredEmployees = employeesList
    .filter(Boolean)
    .filter(employee => {
      if (!searchQuery) return true;
      const fullName = `${employee.firstName} ${employee.lastName} ${employee.jobPosition}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  
  console.log('[EmployeeSelect] Filtered results:', {
    total: employeesList.length,
    filtered: filteredEmployees.length,
    searchQuery
  });

  const handleEmployeeSelect = (employeeId: string) => {
    console.log('[EmployeeSelect] Employee selected:', employeeId);
    onChange(employeeId);
    setOpen(false);
  };

  const displayValue = selectedEmployee 
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` 
    : 'Select employee...';

  return (
    <Popover 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log('[EmployeeSelect] Popover state changing to:', newOpen);
        setOpen(newOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="employee-select"
          name="employee-select"
          onClick={() => console.log('[EmployeeSelect] Trigger clicked')}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ zIndex: 50 }}>
        <div className="max-h-[300px] overflow-y-auto">
          <div className="flex items-center border-b px-3 py-2 bg-background">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={searchInputRef}
              placeholder="Search employee..."
              className="h-9 px-0 border-none bg-transparent focus-visible:ring-0 focus:ring-0 text-sm flex-1"
              value={searchQuery}
              onChange={(e) => {
                console.log('[EmployeeSelect] Search input changed:', e.target.value);
                setSearchQuery(e.target.value);
              }}
              id="employee-search"
              aria-label="Search for an employee"
            />
          </div>
          
          {loading ? (
            <div className="py-6 text-center text-sm">
              Loading employees...
            </div>
          ) : (
            <>
              {filteredEmployees.length === 0 && (
                <div className="py-6 text-center text-sm">
                  No employee found.
                </div>
              )}
              
              <div className="p-2">
                {filteredEmployees.map((employee) => {
                  const isSelected = value === employee.id;
                  console.log('[EmployeeSelect] Rendering employee:', {
                    id: employee.id,
                    name: `${employee.firstName} ${employee.lastName}`,
                    isSelected
                  });
                  
                  return (
                    <div
                      key={employee.id}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleEmployeeSelect(employee.id)}
                      onKeyDown={(e) => {
                        console.log('[EmployeeSelect] Key pressed on employee:', e.key);
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleEmployeeSelect(employee.id);
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                          <div className="text-xs text-muted-foreground">{employee.jobPosition}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
