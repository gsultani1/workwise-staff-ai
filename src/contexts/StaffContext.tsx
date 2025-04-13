
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
};

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');

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
        role: emp.role,
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees when the context is initialized
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <StaffContext.Provider 
      value={{ 
        employees, 
        filteredEmployees,
        loading,
        setEmployees, 
        setFilteredEmployees,
        fetchEmployees
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
