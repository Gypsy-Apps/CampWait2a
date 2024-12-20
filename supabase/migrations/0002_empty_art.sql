/*
  # Create default admin user and staff profile

  1. New Data
    - Creates a default admin user with email/password
    - Creates an organization "Demo Campground Co"
    - Creates a campground "Pine Valley Campground"
    - Creates staff profile for admin user
  
  2. Security
    - Uses secure password hashing
    - Links user to staff profile
*/

-- Insert organization
INSERT INTO organizations (id, name)
VALUES ('d7b5d6de-5f54-4c3d-a762-c0b4b3e4f8e9', 'Demo Campground Co')
ON CONFLICT DO NOTHING;

-- Insert campground
INSERT INTO campgrounds (id, org_id, name, location)
VALUES (
  'f6d8a32e-7c3b-4c1c-b7e9-a5d4c9e4b3a2',
  'd7b5d6de-5f54-4c3d-a762-c0b4b3e4f8e9',
  'Pine Valley Campground',
  'Pine Valley, CA'
) ON CONFLICT DO NOTHING;

-- Create admin user (email: admin@demo.com, password: demo1234)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  'b6d2e6a1-4c3b-4c1c-b7e9-a5d4c9e4b3a2',
  'admin@demo.com',
  crypt('demo1234', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT DO NOTHING;

-- Create staff profile for admin
INSERT INTO staff (
  id,
  user_id,
  org_id,
  campground_id,
  role
) VALUES (
  'a1b2c3d4-5e6f-4c1c-b7e9-a5d4c9e4b3a2',
  'b6d2e6a1-4c3b-4c1c-b7e9-a5d4c9e4b3a2',
  'd7b5d6de-5f54-4c3d-a762-c0b4b3e4f8e9',
  'f6d8a32e-7c3b-4c1c-b7e9-a5d4c9e4b3a2',
  'Manager'
) ON CONFLICT DO NOTHING;