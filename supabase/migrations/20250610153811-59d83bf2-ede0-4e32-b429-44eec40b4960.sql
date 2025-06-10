
-- First, let's update the profiles table to include the missing columns
ALTER TABLE public.profiles 
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN email text;

-- Update the handle_new_user function to work with the current schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_employee_id uuid;
BEGIN
  -- First create an employee record
  INSERT INTO public.employees (first_name, last_name, email, department, job_position, status)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.email,
    'Unassigned',
    'Employee',
    'Active'
  )
  RETURNING id INTO new_employee_id;
  
  -- Then create the profile record linking to the employee
  INSERT INTO public.profiles (id, employee_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    new_employee_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.email
  );
  
  -- Give new users the 'employee' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'employee');
  
  RETURN NEW;
END;
$$;

-- Make sure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
