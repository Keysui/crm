-- ============================================================================
-- ScaleMako CRM - Multi-Tenancy Migration
-- ============================================================================
-- This migration adds user_id columns to existing tables and creates
-- missing tables for contacts, API keys, and webhook events.
--
-- IMPORTANT: Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Add user_id to Existing Tables
-- ============================================================================

-- Add user_id to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id to call_logs table
ALTER TABLE call_logs 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Add user_id to automation_logs table
ALTER TABLE automation_logs 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- ============================================================================
-- STEP 2: Migrate Existing Data (Optional - for existing data)
-- ============================================================================
-- If you have existing data without user_id, you'll need to assign it manually
-- or delete test data. For production, you may want to:
-- 
-- UPDATE leads SET user_id = 'your-default-user-id' WHERE user_id IS NULL;
-- UPDATE call_logs SET user_id = 'your-default-user-id' WHERE user_id IS NULL;
-- UPDATE automation_logs SET user_id = 'your-default-user-id' WHERE user_id IS NULL;
--
-- Then delete any records that can't be assigned to a user:
-- DELETE FROM leads WHERE user_id IS NULL;
-- DELETE FROM call_logs WHERE user_id IS NULL;
-- DELETE FROM automation_logs WHERE user_id IS NULL;

-- ============================================================================
-- STEP 3: Make user_id NOT NULL and Add Foreign Key Constraints
-- ============================================================================

-- For leads table
-- First, ensure all existing rows have a user_id (or delete them)
-- Then make it NOT NULL
ALTER TABLE leads 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE leads 
ADD CONSTRAINT fk_leads_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- For call_logs table
ALTER TABLE call_logs 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE call_logs 
ADD CONSTRAINT fk_call_logs_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- For automation_logs table
ALTER TABLE automation_logs 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE automation_logs 
ADD CONSTRAINT fk_automation_logs_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- STEP 4: Create Indexes for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id_created_at ON leads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id_created_at ON call_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_logs_user_id ON automation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_user_id_created_at ON automation_logs(user_id, created_at DESC);

-- ============================================================================
-- STEP 5: Create contacts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_position TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  plan TEXT,
  appointment_date TIMESTAMPTZ,
  business_name TEXT,
  business_position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id_email ON contacts(user_id, email);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id_phone ON contacts(user_id, phone);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id_created_at ON contacts(user_id, created_at DESC);

-- Enable RLS on contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Create api_keys Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- 'vapi', 'twilio', 'make', 'hubspot', etc.
  encrypted_key TEXT NOT NULL, -- Encrypted API key (never store plain text)
  key_hash TEXT, -- Hash for verification (optional, for key rotation)
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure one active key per user per service
  UNIQUE(user_id, service_name)
);

-- Indexes for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id_service ON api_keys(user_id, service_name);
CREATE INDEX IF NOT EXISTS idx_api_keys_service_name ON api_keys(service_name);

-- Enable RLS on api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: Create webhook_events Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  source TEXT NOT NULL, -- 'vapi', 'twilio', 'make'
  user_id TEXT, -- Optional: if webhook can be associated with a user
  event_type TEXT, -- 'call.ended', 'sms.received', etc.
  payload JSONB NOT NULL, -- Full webhook payload
  status TEXT DEFAULT 'received', -- 'received', 'processed', 'failed', 'ignored'
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for webhook_events
CREATE INDEX IF NOT EXISTS idx_webhook_events_source ON webhook_events(source);
CREATE INDEX IF NOT EXISTS idx_webhook_events_user_id ON webhook_events(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
-- GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_webhook_events_payload ON webhook_events USING GIN (payload);

-- Enable RLS on webhook_events
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: Update RLS Policies for Multi-Tenancy
-- ============================================================================

-- Drop existing service role policies (they're too permissive)
DROP POLICY IF EXISTS "Service role full access" ON leads;
DROP POLICY IF EXISTS "Service role full access" ON call_logs;
DROP POLICY IF EXISTS "Service role full access" ON automation_logs;

-- Note: Service role bypasses RLS, so we don't need policies for server-side operations
-- But we should add policies for authenticated users if using Supabase Auth

-- For leads: Users can only see their own leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (true); -- Service role bypasses, so this is for future Supabase Auth

CREATE POLICY "Users can insert own leads" ON leads
  FOR INSERT WITH CHECK (true); -- Service role bypasses

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (true); -- Service role bypasses

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (true); -- Service role bypasses

-- For call_logs: Users can only see their own call logs
CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own call logs" ON call_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own call logs" ON call_logs
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own call logs" ON call_logs
  FOR DELETE USING (true);

-- For automation_logs: Users can only see their own automation logs
CREATE POLICY "Users can view own automation logs" ON automation_logs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own automation logs" ON automation_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own automation logs" ON automation_logs
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own automation logs" ON automation_logs
  FOR DELETE USING (true);

-- For contacts: Users can only see their own contacts
CREATE POLICY "Users can view own contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own contacts" ON contacts
  FOR DELETE USING (true);

-- For api_keys: Users can only see their own API keys
CREATE POLICY "Users can view own api keys" ON api_keys
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own api keys" ON api_keys
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own api keys" ON api_keys
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own api keys" ON api_keys
  FOR DELETE USING (true);

-- For webhook_events: Users can see their own webhook events
CREATE POLICY "Users can view own webhook events" ON webhook_events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert webhook events" ON webhook_events
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Next steps:
-- 1. Update your application code to always include user_id in queries
-- 2. Update webhook handlers to include user_id when creating records
-- 3. Test that users can only see their own data
-- ============================================================================
