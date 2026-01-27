# Multi-Tenancy Implementation Guide

This guide explains how to update your codebase to use the new multi-tenant database schema.

## Overview

After running the migration SQL, all data tables now include a `user_id` column. **You must always filter queries by `user_id`** to ensure users only see their own data.

## Database Schema Changes

### Tables with `user_id` Added:
- ✅ `leads` - Now has `user_id` column
- ✅ `call_logs` - Now has `user_id` column  
- ✅ `automation_logs` - Now has `user_id` column

### New Tables Created:
- ✅ `contacts` - For contact management
- ✅ `api_keys` - For encrypted API key storage
- ✅ `webhook_events` - For webhook audit logging

## How to Update Your Queries

### Option 1: Use Helper Functions (Recommended)

Use the helper functions in `lib/db-helpers.ts` which automatically include `user_id`:

```typescript
import { getUserLeads, createUserLead, getUserDashboardStats } from '@/lib/db-helpers'

// Get all leads for current user
const { data: leads, error } = await getUserLeads()

// Create a lead for current user
const { data: newLead, error } = await createUserLead({
  name: "John Doe",
  phone: "+1234567890",
  status: "new",
  source: "Voice"
})

// Get dashboard stats for current user
const stats = await getUserDashboardStats()
```

### Option 2: Manual Queries with `getCurrentUserId()`

For custom queries, always include `user_id`:

```typescript
import { getCurrentUserId } from '@/lib/db-helpers'
import { db } from '@/lib/db'

// ✅ CORRECT: Filter by user_id
const userId = await getCurrentUserId()
const { data, error } = await db
  .from('leads')
  .select('*')
  .eq('user_id', userId)  // ← Always include this!
  .order('created_at', { ascending: false })

// ❌ WRONG: Missing user_id filter
const { data, error } = await db
  .from('leads')
  .select('*')
  // Missing .eq('user_id', userId) - SECURITY RISK!
```

### Option 3: Using `withUserId()` Helper

For complex queries:

```typescript
import { withUserId } from '@/lib/db-helpers'
import { db } from '@/lib/db'

const userId = await getCurrentUserId()
const query = await withUserId(db.from('leads'))
const { data } = await query
  .select('*')
  .eq('status', 'new')
  .order('created_at', { ascending: false })
```

## Updating Webhook Handlers

Webhook handlers must determine which `user_id` to use. Options:

### Option 1: Webhook Payload Includes `user_id`

If your webhook configuration includes a `user_id` in the payload:

```typescript
// app/api/webhooks/vapi/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const userId = body.user_id // From webhook payload
  
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  const { data: callLog } = await db
    .from("call_logs")
    .insert({
      phone: body.phone,
      user_id: userId, // ← Include user_id
      // ... other fields
    })
}
```

### Option 2: Webhook URL Includes User Identifier

If your webhook URL includes a user identifier:

```typescript
// app/api/webhooks/vapi/[userId]/route.ts
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId
  
  const { data: callLog } = await db
    .from("call_logs")
    .insert({
      phone: body.phone,
      user_id: userId,
      // ... other fields
    })
}
```

### Option 3: Service-Level Webhooks (Not Recommended)

If webhooks are configured at the service level (not per-user), you'll need to:
1. Store a mapping of phone numbers to `user_id`
2. Look up the `user_id` based on the phone number in the webhook

```typescript
// Look up user by phone number
const { data: userMapping } = await db
  .from('user_phone_numbers') // You'd need to create this table
  .select('user_id')
  .eq('phone', phoneNumber)
  .single()

const userId = userMapping?.user_id
```

## Updating Existing Code

### Example: Dashboard Stats

**Before (Mock Data):**
```typescript
const stats = {
  totalLeads: 1247,
  conversionRate: "28.4%",
  // ... hardcoded values
}
```

**After (Real Data with Multi-Tenancy):**
```typescript
import { getUserDashboardStats } from '@/lib/db-helpers'

const stats = await getUserDashboardStats()
// Returns: { totalLeads: 42, totalCalls: 156, totalContacts: 23, ... }
```

### Example: Leads Page

**Before:**
```typescript
const { data: leads } = await db.from('leads').select('*')
```

**After:**
```typescript
import { getUserLeads } from '@/lib/db-helpers'

const { data: leads, error } = await getUserLeads()
// Automatically filtered by current user's ID
```

### Example: Contacts Page

**Before (localStorage):**
```typescript
const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]')
```

**After (Database with Multi-Tenancy):**
```typescript
import { getUserContacts, createUserContact } from '@/lib/db-helpers'

// Load contacts
const { data: contacts } = await getUserContacts()

// Create contact
const { data: newContact } = await createUserContact({
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "+1234567890"
})
```

## Security Checklist

When updating code, ensure:

- [ ] All `SELECT` queries include `.eq('user_id', userId)`
- [ ] All `INSERT` queries include `user_id` in the data
- [ ] All `UPDATE` queries include `.eq('user_id', userId)` in the filter
- [ ] All `DELETE` queries include `.eq('user_id', userId)` in the filter
- [ ] Webhook handlers determine `user_id` before creating records
- [ ] No queries bypass `user_id` filtering (even for "admin" users)

## Testing Multi-Tenancy

1. **Create two test users** in your database
2. **Login as User 1** and create some leads/contacts
3. **Login as User 2** and verify you cannot see User 1's data
4. **Verify** that User 2 can create their own data
5. **Check** that webhooks create records with the correct `user_id`

## Common Pitfalls

### ❌ Forgetting user_id in INSERT
```typescript
// WRONG
await db.from('leads').insert({ name: "John", phone: "123" })

// CORRECT
const userId = await getCurrentUserId()
await db.from('leads').insert({ name: "John", phone: "123", user_id: userId })
```

### ❌ Not filtering by user_id in SELECT
```typescript
// WRONG - Shows all users' data!
const { data } = await db.from('leads').select('*')

// CORRECT
const userId = await getCurrentUserId()
const { data } = await db.from('leads').select('*').eq('user_id', userId)
```

### ❌ Updating without user_id filter
```typescript
// WRONG - Could update any user's data!
await db.from('leads').update({ status: 'closed' }).eq('id', leadId)

// CORRECT
const userId = await getCurrentUserId()
await db.from('leads')
  .update({ status: 'closed' })
  .eq('id', leadId)
  .eq('user_id', userId) // ← Important!
```

## Migration Notes

If you have existing data without `user_id`:

1. **Option A: Delete test data** (recommended for development)
   ```sql
   DELETE FROM leads WHERE user_id IS NULL;
   DELETE FROM call_logs WHERE user_id IS NULL;
   DELETE FROM automation_logs WHERE user_id IS NULL;
   ```

2. **Option B: Assign to a default user** (if you have production data)
   ```sql
   UPDATE leads SET user_id = 'your-user-id' WHERE user_id IS NULL;
   -- Repeat for other tables
   ```

3. **Option C: Create a migration script** to assign data based on business logic

## Next Steps

1. ✅ Run the migration SQL (`supabase-migration-multi-tenancy.sql`)
2. ✅ Update all database queries to include `user_id`
3. ✅ Update webhook handlers to include `user_id`
4. ✅ Test with multiple users
5. ✅ Remove mock data from dashboard
6. ✅ Migrate contacts from localStorage to database

---

**Questions?** Review the helper functions in `lib/db-helpers.ts` for examples.
