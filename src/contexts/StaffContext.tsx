
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  // Initialize with some mock data for the entire app
  useEffect(() => {
    const mockEmployees = [
      { 
        id: '1', 
        firstName: 'Sarah', 
        lastName: 'Johnson', 
        email: 'sarah.j@example.com', 
        department: 'Sales', 
        role: 'Cashier' 
      },
      { 
        id: '2', 
        firstName: 'Michael', 
        lastName: 'Smith', 
        email: 'm.smith@example.com', 
        department: 'Inventory', 
        role: 'Manager' 
      },
      { 
        id: '3', 
        firstName: 'Jessica', 
        lastName: 'Williams', 
        email: 'j.williams@example.com', 
        department: 'Customer Service', 
        role: 'Team Lead' 
      },
      { 
        id: '4', 
        firstName: 'David', 
        lastName: 'Brown', 
        email: 'd.brown@example.com', 
        department: 'Sales', 
        role: 'Associate' 
      },
      { 
        id: '5', 
        firstName: 'Emily', 
        lastName: 'Davis', 
        email: 'e.davis@example.com', 
        department: 'Management', 
        role: 'Director' 
      }
    ];
    
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

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
