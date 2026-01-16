# How to Get Your Supabase Credentials

## Step 1: Go to Supabase Dashboard

1. Visit [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

## Step 2: Get Your Credentials

1. In your project dashboard, click on **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu

## Step 3: Copy Your Credentials

You'll see two important values:

### Project URL (for SUPABASE_URL)
- Look for **"Project URL"** or **"URL"**
- It looks like: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this entire URL

### Service Role Key (for SUPABASE_SERVICE_ROLE_KEY)
- Look for **"service_role"** key (NOT the "anon" key)
- It's a long string that starts with `eyJ...`
- Click the eye icon to reveal it, then copy it
- ⚠️ **Important**: This key has admin access. Never expose it in client-side code!

## Step 4: Update Your .env File

Open your `.env` file in the project root and update:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- No quotes needed around the values
- No spaces around the `=` sign
- Make sure the URL starts with `https://`
- Use the **service_role** key, not the anon key

## Step 5: Run the Script

After updating your `.env` file:

```bash
npm run create-user
```

## Troubleshooting

**"Invalid supabaseUrl" error:**
- Make sure the URL starts with `https://`
- Remove any quotes around the URL
- Make sure there are no trailing spaces

**"Invalid API key" error:**
- Make sure you're using the **service_role** key, not the anon key
- Check that the key is copied completely (it's very long)
- Make sure there are no spaces or line breaks in the key
