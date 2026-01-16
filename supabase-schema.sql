-- Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  business_name TEXT,
  role TEXT DEFAULT 'user',
  email_verified BOOLEAN DEFAULT false,
  failed_login_count INTEGER DEFAULT 0,
  lock_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  ai_summary TEXT,
  source TEXT NOT NULL,
  sentiment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  phone TEXT,
  recording_url TEXT,
  duration INTEGER,
  sentiment TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  action_type TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_call_logs_phone ON call_logs(phone);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (server-side operations)
-- Service role bypasses RLS, so these policies allow all operations
CREATE POLICY "Service role full access" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON call_logs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON automation_logs
  FOR ALL USING (true) WITH CHECK (true);
