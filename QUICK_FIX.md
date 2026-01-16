# Quick Fix for Supabase Connection

## Issue
If you're getting database connection errors, follow these steps:

## Steps to Fix

### 1. Verify Supabase Project is Running

1. Go to [supabase.com](https://supabase.com) and check your project status
2. Make sure the project is active (not paused)

### 2. Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste contents of `supabase-schema.sql`
3. Click **Run** to execute
4. Verify tables were created in **Table Editor**

### 3. Check Environment Variables

Make sure your `.env` file has:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** 
- Get these from **Settings** → **API** in Supabase dashboard
- Use the **service_role** key, NOT the anon key
- Never commit these to git

### 4. Seed Database

```bash
npm run db:seed
```

This should create the test user. If it fails, check:
- Tables exist in Supabase Table Editor
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Service role key has proper permissions

### 5. Test Login

Visit http://localhost:3000/login and use:
- **Email:** admin@example.com
- **Password:** password123

## Common Errors

**"Invalid API key"**
- Make sure you're using the **service_role** key, not anon key
- Verify the key is copied correctly (no extra spaces)

**"relation does not exist"**
- Run `supabase-schema.sql` in SQL Editor
- Check that tables appear in Table Editor

**"Row Level Security policy violation"**
- The service role should bypass RLS
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY`, not anon key

## Need Help?

1. Check Supabase dashboard for project status
2. Verify tables exist in Table Editor
3. Check server logs for detailed error messages
4. Ensure `.env` file is in project root (not committed to git)
