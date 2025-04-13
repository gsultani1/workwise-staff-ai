
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee } from '@/types/employee'; // Assume this type exists

type StaffContextType = {
  employees: Employee[];
  filteredEmployees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  setFilteredEmployees: (employees: Employee[]) => void;
};

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  return (
    <StaffContext.Provider 
      value={{ 
        employees, 
        filteredEmployees, 
        setEmployees, 
        setFilteredEmployees 
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
