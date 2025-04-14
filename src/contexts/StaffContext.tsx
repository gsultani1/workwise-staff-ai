
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { toast } from '@/hooks/use-toast';

type StaffContextType = {
  employees: Employee[];
  filteredEmployees: Employee[];
  loading: boolean;
  setEmployees: (employees: Employee[]) => void;
  setFilteredEmployees: (employees: Employee[]) => void;
  fetchEmployees: () => Promise<void>;
  searchEmployees: (query: string) => Promise<void>;
};

// Create context with default values
const StaffContext = createContext<StaffContextType>({
  employees: [],
  filteredEmployees: [],
  loading: false,
  setEmployees: () => {},
  setFilteredEmployees: () => {},
  fetchEmployees: async () => {},
  searchEmployees: async () => {},
});

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with empty arrays, not undefined
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching employees...');
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        throw error;
      }

      console.log('Employees fetched:', data);

      // Transform data to match our Employee type
      const transformedData: Employee[] = data.map(emp => ({
        id: emp.id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        department: emp.department,
        jobPosition: emp.job_position,
        status: emp.status,
        hireDate: emp.hire_date
      }));

      setEmployees(transformedData);
      setFilteredEmployees(transformedData);
    } catch (error: any) {
      console.error('Error fetching employees:', error.message);
      toast({
        title: 'Error fetching employees',
        description: error.message,
        variant: 'destructive',
      });
      // Initialize with empty arrays rather than leaving as undefined
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Backend search functionality
  const searchEmployees = async (query: string) => {
    if (!query.trim()) {
      // If query is empty, show all employees
      setFilteredEmployees(employees);
      return;
    }

    setLoading(true);
    try {
      const queryLower = query.toLowerCase().trim();
      
      // Use Supabase's ilike operator for case-insensitive search
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .or(`first_name.ilike.%${queryLower}%,last_name.ilike.%${queryLower}%,email.ilike.%${queryLower}%,department.ilike.%${queryLower}%,job_position.ilike.%${queryLower}%`);

      if (error) {
        throw error;
      }

      // Transform data to match our Employee type
      const transformedData: Employee[] = data.map(emp => ({
        id: emp.id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        email: emp.email,
        department: emp.department,
        jobPosition: emp.job_position,
        status: emp.status,
        hireDate: emp.hire_date
      }));

      setFilteredEmployees(transformedData);
    } catch (error: any) {
      console.error('Error searching employees:', error.message);
      toast({
        title: 'Error searching employees',
        description: error.message,
        variant: 'destructive',
      });
      // Fallback to client-side filtering in case of error
      const filteredResults = employees.filter(employee => 
        employee.firstName.toLowerCase().includes(query.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(query.toLowerCase()) ||
        employee.email.toLowerCase().includes(query.toLowerCase()) ||
        employee.department.toLowerCase().includes(query.toLowerCase()) ||
        employee.jobPosition.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmployees(filteredResults);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees when the context is initialized
  useEffect(() => {
    console.log('StaffContext mounted, fetching employees...');
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <StaffContext.Provider 
      value={{ 
        employees, 
        filteredEmployees,
        loading,
        setEmployees, 
        setFilteredEmployees,
        fetchEmployees,
        searchEmployees
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaffContext = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaffContext must be used within a StaffProvider');
  }
  return context;
};
