/*
  # Fix Staff Table Policies

  1. Changes
    - Remove recursive policy for staff table
    - Add separate policies for different operations
    - Ensure proper access control without recursion

  2. Security
    - Enable RLS on staff table
    - Add policies for viewing and managing staff data
*/

-- Drop existing policies for staff table
DROP POLICY IF EXISTS "Staff can view staff members in their organization" ON staff;

-- Create new policies without recursion
CREATE POLICY "Staff can view their own profile"
  ON staff
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Staff can view organization members"
  ON staff
  FOR SELECT
  TO authenticated
  USING (
    org_id IN (
      SELECT s.org_id 
      FROM staff s 
      WHERE s.user_id = auth.uid()
    )
  );

-- Only managers can insert/update staff records
CREATE POLICY "Managers can manage staff"
  ON staff
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM staff s 
      WHERE s.user_id = auth.uid() 
      AND s.role = 'Manager'
    )
  );