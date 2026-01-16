# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Create a new project
4. Wait for database to be ready (~2 minutes)

## 2. Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to execute

This creates all required tables with proper structure.

## 3. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** → `SUPABASE_URL`
3. Copy your **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## 4. Update .env File

Add these to your `.env` file:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Other required vars
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: For rate limiting
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"
```

## 5. Seed Database

```bash
npm run db:seed
```

## 6. Test Login

- Email: `admin@example.com`
- Password: `password123`

## Important Notes

- **Service Role Key**: This has admin access. Never expose it in client-side code.
- **Row Level Security**: Enabled on all tables. Service role bypasses RLS for server-side operations.
- **Column Names**: Supabase uses snake_case (e.g., `business_name`, `failed_login_count`)
