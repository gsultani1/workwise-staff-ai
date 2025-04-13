
import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { searchEmployees } from '@/utils/searchUtils';
import { useStaffContext } from '@/contexts/StaffContext';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { employees, setFilteredEmployees } = useStaffContext();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const filteredResults = searchEmployees(employees, searchQuery);
    setFilteredEmployees(filteredResults);
  }, [employees, searchQuery, setFilteredEmployees]);

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredEmployees(employees);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Filter results as user types
    if (value.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filteredResults = searchEmployees(employees, value);
      setFilteredEmployees(filteredResults);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search employees by name, department..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className="w-full rounded-md border border-input bg-background pl-8 py-2 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {searchQuery && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </form>
  );
};
