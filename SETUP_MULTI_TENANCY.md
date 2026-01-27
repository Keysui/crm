# Multi-Tenancy & Secure API Key Storage - Setup Instructions

## Quick Start

This guide will help you implement multi-tenancy and secure API key storage in your ScaleMako CRM.

## Step 1: Generate Encryption Keys

Before running the migration, generate your encryption keys:

```bash
# Generate JWT Secret (if not already set)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Encryption Key (for API key storage)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add these to your `.env.local` file:
```env
JWT_SECRET=your-generated-jwt-secret-64-chars
ENCRYPTION_KEY=your-generated-encryption-key-64-chars
```

## Step 2: Run Database Migration

1. Open your **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `supabase-migration-multi-tenancy.sql`
3. Paste and run the SQL script
4. Verify the migration succeeded (check for errors)

**Important:** If you have existing data without `user_id`, you'll need to either:
- Delete test data: `DELETE FROM leads WHERE user_id IS NULL;`
- Or assign it to a user: `UPDATE leads SET user_id = 'your-user-id' WHERE user_id IS NULL;`

## Step 3: Update Your Code

### 3.1 Update Webhook Handlers

Update `app/api/webhooks/vapi/route.ts` and `app/api/webhooks/twilio/route.ts` to include `user_id`:

```typescript
// Example for Vapi webhook
export async function POST(request: Request) {
  const body = await request.json()
  
  // TODO: Determine user_id from webhook payload or configuration
  // Option 1: If webhook includes user_id
  const userId = body.user_id
  
  // Option 2: If you have a phone-to-user mapping
  // const { data: mapping } = await db.from('user_phone_numbers')...
  
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const { data: callLog } = await db
    .from("call_logs")
    .insert({
      phone: phoneNumber,
      user_id: userId, // ← Add this
      recording_url: recordingUrl,
      // ... rest of fields
    })
}
```

### 3.2 Update Dashboard Queries

Replace mock data with real queries using helper functions:

```typescript
// Before
const stats = { totalLeads: 1247, ... } // Mock data

// After
import { getUserDashboardStats } from '@/lib/db-helpers'
const stats = await getUserDashboardStats()
```

### 3.3 Update Contacts Page

Migrate from localStorage to database:

```typescript
// Before
const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]')

// After
import { getUserContacts } from '@/lib/db-helpers'
const { data: contacts } = await getUserContacts()
```

## Step 4: Test the Implementation

1. **Create two test users** in your database
2. **Login as User 1** and create some leads/contacts
3. **Login as User 2** and verify:
   - You cannot see User 1's data
   - You can create your own data
   - Dashboard shows only your data
4. **Test API key storage:**
   - Go to CRM Integrations page
   - Enter an API key for a service
   - Verify it saves (check database `api_keys` table)
   - Verify the key is encrypted (should be base64 string, not plain text)

## Step 5: Verify Security

### Check Database
```sql
-- Verify user_id columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'user_id';

-- Verify API keys are encrypted
SELECT id, service_name, encrypted_key FROM api_keys LIMIT 1;
-- encrypted_key should be a long base64 string, not plain text
```

### Check Code
- ✅ All queries include `.eq('user_id', userId)`
- ✅ All inserts include `user_id` field
- ✅ API keys are saved via server action (not component state)
- ✅ No hardcoded user IDs in queries

## Troubleshooting

### Error: "ENCRYPTION_KEY environment variable is required"
- Make sure you've added `ENCRYPTION_KEY` to your `.env.local` file
- Restart your development server after adding environment variables

### Error: "Unauthorized: No active session"
- Make sure you're logged in
- Check that your JWT token is valid
- Verify `JWT_SECRET` is set correctly

### Webhooks not working
- Verify webhook handlers include `user_id` when creating records
- Check that you've configured how to determine `user_id` from webhook payloads
- Review webhook logs in `webhook_events` table

### Users seeing other users' data
- Verify all queries include `.eq('user_id', userId)`
- Check that RLS policies are enabled
- Review `MULTI_TENANCY_GUIDE.md` for query examples

## Files Created/Modified

### New Files:
- ✅ `supabase-migration-multi-tenancy.sql` - Database migration
- ✅ `lib/encryption.ts` - Encryption utilities
- ✅ `app/actions/save-api-key.ts` - Server action for API keys
- ✅ `lib/db-helpers.ts` - Multi-tenant query helpers
- ✅ `MULTI_TENANCY_GUIDE.md` - Detailed guide

### Modified Files:
- ✅ `app/dashboard/crm-integrations/page.tsx` - Uses secure API key storage

## Next Steps

1. ✅ Complete multi-tenancy migration
2. ✅ Implement secure API key storage
3. ⏭️ Update all dashboard queries to use real data
4. ⏭️ Migrate contacts from localStorage to database
5. ⏭️ Add webhook signature verification
6. ⏭️ Implement Make.com integration

---

**Need Help?** Review `MULTI_TENANCY_GUIDE.md` for detailed examples.
