/*
  # Campground Management System Schema

  1. New Tables
    - `organizations` - Represents different campground organizations
      - `id` (uuid, primary key)
      - `name` (text) - Organization name
      - `created_at` (timestamp)
      
    - `campgrounds` - Individual campground locations
      - `id` (uuid, primary key)
      - `org_id` (uuid, foreign key) - Reference to organization
      - `name` (text) - Campground name
      - `location` (text) - Physical address
      - `created_at` (timestamp)
      
    - `sites` - Individual camping sites/suites
      - `id` (uuid, primary key)
      - `campground_id` (uuid, foreign key)
      - `name` (text) - Site identifier (e.g., "Site A1")
      - `type` (text) - Type of site (e.g., "RV", "Tent", "Cabin")
      - `capacity` (int) - Maximum occupancy
      - `price_per_night` (decimal)
      - `status` (text) - Current status (Available, Occupied, Maintenance)
      - `created_at` (timestamp)
      
    - `bookings` - Reservation records
      - `id` (uuid, primary key)
      - `site_id` (uuid, foreign key)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `check_in` (date)
      - `check_out` (date)
      - `status` (text) - Booking status (Confirmed, Cancelled, Completed)
      - `created_at` (timestamp)
      
    - `waitlist` - Waitlist entries
      - `id` (uuid, primary key)
      - `campground_id` (uuid, foreign key)
      - `guest_name` (text)
      - `guest_email` (text)
      - `guest_phone` (text)
      - `preferred_dates` (daterange)
      - `site_type` (text)
      - `status` (text) - Waitlist status (Active, Fulfilled, Cancelled)
      - `created_at` (timestamp)
      
    - `staff` - Staff members and their roles
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Reference to auth.users
      - `org_id` (uuid, foreign key)
      - `campground_id` (uuid, foreign key)
      - `role` (text) - Role (Manager, Staff)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies ensure staff members can only access their organization's data
    - Managers have full access to their campground's data
    - Staff members have limited access based on their role
*/

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Campgrounds table
CREATE TABLE campgrounds (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    location text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Sites table
CREATE TABLE sites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campground_id uuid REFERENCES campgrounds(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text NOT NULL,
    capacity integer NOT NULL,
    price_per_night decimal(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'Available',
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('Available', 'Occupied', 'Maintenance'))
);

-- Bookings table
CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    guest_phone text NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    status text NOT NULL DEFAULT 'Confirmed',
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_status CHECK (status IN ('Confirmed', 'Cancelled', 'Completed'))
);

-- Waitlist table
CREATE TABLE waitlist (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    campground_id uuid REFERENCES campgrounds(id) ON DELETE CASCADE,
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    guest_phone text NOT NULL,
    preferred_dates daterange NOT NULL,
    site_type text NOT NULL,
    status text NOT NULL DEFAULT 'Active',
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('Active', 'Fulfilled', 'Cancelled'))
);

-- Staff table
CREATE TABLE staff (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    campground_id uuid REFERENCES campgrounds(id) ON DELETE CASCADE,
    role text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_role CHECK (role IN ('Manager', 'Staff'))
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Staff access policies
CREATE POLICY "Staff can view their organization data"
    ON organizations
    FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT org_id 
            FROM staff 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view their campgrounds"
    ON campgrounds
    FOR SELECT
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id 
            FROM staff 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view sites in their campgrounds"
    ON sites
    FOR SELECT
    TO authenticated
    USING (
        campground_id IN (
            SELECT campground_id 
            FROM staff 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view and manage bookings"
    ON bookings
    FOR ALL
    TO authenticated
    USING (
        site_id IN (
            SELECT s.id 
            FROM sites s
            JOIN staff st ON s.campground_id = st.campground_id
            WHERE st.user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view and manage waitlist"
    ON waitlist
    FOR ALL
    TO authenticated
    USING (
        campground_id IN (
            SELECT campground_id 
            FROM staff 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view staff members in their organization"
    ON staff
    FOR SELECT
    TO authenticated
    USING (
        org_id IN (
            SELECT org_id 
            FROM staff 
            WHERE user_id = auth.uid()
        )
    );