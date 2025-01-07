/*
  # Add user tracking tables and functions

  1. New Tables
    - `user_sessions`
      - Tracks user login sessions with device and location info
    - `user_devices`
      - Stores unique device fingerprints and their properties
    
  2. Changes
    - Added foreign key relationships to users table
    
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create user_devices table
CREATE TABLE IF NOT EXISTS user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_agent text NOT NULL,
  browser_name text,
  browser_version text,
  os_name text,
  os_version text,
  device_type text,
  created_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  
  UNIQUE(user_agent)
);

ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id),
  device_id uuid NOT NULL REFERENCES user_devices(id),
  ip_address inet,
  country_code text,
  region text,
  city text,
  language text,
  created_at timestamptz DEFAULT now(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own devices"
  ON user_devices
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT device_id 
      FROM user_sessions 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());