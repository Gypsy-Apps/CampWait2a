/*
  # Add Guest Management and Campground Features

  1. New Tables
    - `guests`
      - Basic guest information
      - Contact details
      - Notes and preferences
    - `accommodations`
      - Detailed information about sites/suites
      - Images and descriptions
      - Capacity and amenities
    - `guest_bookings`
      - Links guests to accommodations
      - Tracks booking dates and status

  2. Security
    - Enable RLS on all new tables
    - Add policies for staff access
*/

-- Create accommodations table
CREATE TABLE IF NOT EXISTS accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campground_id uuid REFERENCES campgrounds(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Site', 'Suite')),
  image_url text,
  room_count integer,
  capacity integer NOT NULL,
  amenities text[],
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campground_id uuid REFERENCES campgrounds(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create guest_bookings table
CREATE TABLE IF NOT EXISTS guest_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  accommodation_id uuid REFERENCES accommodations(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Enable RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can manage accommodations"
  ON accommodations
  FOR ALL
  TO authenticated
  USING (campground_id IN (
    SELECT campground_id FROM staff WHERE user_id = auth.uid()
  ));

CREATE POLICY "Staff can manage guests"
  ON guests
  FOR ALL
  TO authenticated
  USING (campground_id IN (
    SELECT campground_id FROM staff WHERE user_id = auth.uid()
  ));

CREATE POLICY "Staff can manage guest bookings"
  ON guest_bookings
  FOR ALL
  TO authenticated
  USING (
    guest_id IN (
      SELECT g.id FROM guests g
      JOIN staff s ON g.campground_id = s.campground_id
      WHERE s.user_id = auth.uid()
    )
  );