
import { Employee } from '@/types/employee'; // We'll assume this type exists

export const searchEmployees = (employees: Employee[], query: string): Employee[] => {
  if (!query.trim()) return employees;

  const lowercaseQuery = query.toLowerCase().trim();
  
  return employees.filter(employee => 
    employee.firstName.toLowerCase().includes(lowercaseQuery) ||
    employee.lastName.toLowerCase().includes(lowercaseQuery) ||
    employee.email.toLowerCase().includes(lowercaseQuery) ||
    employee.department.toLowerCase().includes(lowercaseQuery)
  );
};
