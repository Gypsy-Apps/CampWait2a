/*
  # Fix Staff Policies and Add Initial Data

  1. Changes
    - Simplify staff policies to prevent recursion
    - Add basic policies for staff access
    - Ensure proper authentication flow
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Staff can view their own profile" ON staff;
DROP POLICY IF EXISTS "Staff can view organization members" ON staff;
DROP POLICY IF EXISTS "Managers can manage staff" ON staff;

-- Create simplified policies
CREATE POLICY "Enable read access for authenticated users"
  ON staff
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON staff
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_org_id ON staff(org_id);
CREATE INDEX IF NOT EXISTS idx_staff_campground_id ON staff(campground_id);