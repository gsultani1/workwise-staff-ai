
export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobPosition: string;  // Updated from "role" to "jobPosition"
  status?: string;
  hireDate?: string;
};
