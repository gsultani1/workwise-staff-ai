
export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobPosition: string;
  status?: string;
  hireDate?: string;
};

// Update TimeOffRequest type to make user_id optional since it's no longer in the database
export type TimeOffRequest = {
  id: string;
  employee_id: string;
  user_id?: string; // Make user_id optional
  type: string;
  start_date: string;
  end_date: string;
  date_submitted: string;
  status: "pending" | "approved" | "denied";
  reason: string | null;
  updated_at: string;
  employee_first_name?: string;
  employee_last_name?: string;
};

// Add TimeOffHistory type here for consistency
export type TimeOffHistory = {
  id: string;
  employee_id: string;
  employee_first_name?: string;
  employee_last_name?: string;
  type: string;
  start_date: string;
  end_date: string;
  status: "approved" | "denied";
  reason?: string | null;
  date_submitted?: string;
  updated_at?: string;
  user_id?: string; // Make user_id optional here as well
};

// Add UserProfile type for better organization
export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url?: string | null;
  employee_id?: string;
  updated_at?: string;
  roles: string[];
};

// Add Profile type for Auth context
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  employee_id: string;
  updated_at?: string;
};
