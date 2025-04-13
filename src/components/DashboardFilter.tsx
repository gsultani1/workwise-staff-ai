
import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type TimeRange = 'today' | 'this-week' | 'this-month' | 'custom';
type Department = 'all' | 'sales' | 'customer-service' | 'inventory' | 'management';

export const DashboardFilter: React.FC<{
  onFilterChange: (filters: { timeRange: TimeRange; department: Department }) => void;
}> = ({ onFilterChange }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [department, setDepartment] = useState<Department>('all');
  const [activeFilters, setActiveFilters] = useState<number>(0);

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    onFilterChange({ timeRange: value, department });
    updateActiveFiltersCount(value, department);
  };

  const handleDepartmentChange = (value: Department) => {
    setDepartment(value);
    onFilterChange({ timeRange, department: value });
    updateActiveFiltersCount(timeRange, value);
  };

  const updateActiveFiltersCount = (time: TimeRange, dept: Department) => {
    let count = 0;
    if (time !== 'today') count++;
    if (dept !== 'all') count++;
    setActiveFilters(count);
  };

  const getTimeRangeLabel = (range: TimeRange): string => {
    switch (range) {
      case 'today': return 'Today';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      case 'custom': return 'Custom Range';
    }
  };

  const getDepartmentLabel = (dept: Department): string => {
    switch (dept) {
      case 'all': return 'All Departments';
      case 'sales': return 'Sales';
      case 'customer-service': return 'Customer Service';
      case 'inventory': return 'Inventory';
      case 'management': return 'Management';
    }
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/50">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilters > 0 && (
              <Badge variant="secondary" className="ml-1 bg-workwise-blue text-white">
                {activeFilters}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Time Range</DropdownMenuLabel>
          <DropdownMenuGroup>
            {(['today', 'this-week', 'this-month', 'custom'] as TimeRange[]).map((range) => (
              <DropdownMenuItem 
                key={range}
                className={timeRange === range ? 'bg-muted font-medium' : ''}
                onClick={() => handleTimeRangeChange(range)}
              >
                {getTimeRangeLabel(range)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Department</DropdownMenuLabel>
          <DropdownMenuGroup>
            {(['all', 'sales', 'customer-service', 'inventory', 'management'] as Department[]).map((dept) => (
              <DropdownMenuItem 
                key={dept}
                className={department === dept ? 'bg-muted font-medium' : ''}
                onClick={() => handleDepartmentChange(dept)}
              >
                {getDepartmentLabel(dept)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
