# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for database to be ready (~2 minutes)

## Step 2: Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to execute

This creates all required tables with proper structure.

## Step 3: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** → `SUPABASE_URL`
3. Copy your **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Step 4: Update .env File

Create/update `.env` in project root:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: For rate limiting
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"
```

## Step 5: Seed Database

```bash
npm run db:seed
```

This creates a test user:
- **Email:** admin@example.com
- **Password:** password123

## Step 6: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000/login

## Test Credentials

- **Email:** admin@example.com
- **Password:** password123

## Important Notes

- **Service Role Key**: Never expose in client-side code. Server-only.
- **Row Level Security**: Enabled on all tables. Service role bypasses RLS.
- **Column Names**: Supabase uses snake_case (e.g., `business_name`, `failed_login_count`)

## Troubleshooting

**"relation does not exist" error:**
- Make sure you ran `supabase-schema.sql` in SQL Editor
- Check Tables in Supabase dashboard to verify tables exist

**"Invalid API key" error:**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Make sure you're using the **service_role** key, not the anon key
