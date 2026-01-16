-- Create ScaleMako user in Supabase
-- Run this in Supabase SQL Editor

-- User credentials:
-- Email: sales@scalemako.com
-- Password: Nalasimba2!
-- Hashed password (bcrypt, 12 rounds): $2b$12$Qmga.blNIuft1AM6dQxlG.UWwYA62lH6FmFTbDWLY.00c6GNTxFL.

-- Insert or update the user
INSERT INTO users (email, password, business_name, role, email_verified, failed_login_count, lock_until)
VALUES (
  'sales@scalemako.com',
  '$2b$12$Qmga.blNIuft1AM6dQxlG.UWwYA62lH6FmFTbDWLY.00c6GNTxFL.',
  'ScaleMako',
  'admin',
  true,
  0,
  NULL
)
ON CONFLICT (email) 
DO UPDATE SET
  password = EXCLUDED.password,
  business_name = EXCLUDED.business_name,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified,
  failed_login_count = 0,
  lock_until = NULL,
  updated_at = NOW();
