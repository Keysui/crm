/**
 * Database helper functions for multi-tenant queries
 * These functions ensure all queries are filtered by user_id
 */

import { db } from './db'
import { getSession } from './session'

/**
 * Gets the current user's ID from session
 * Throws an error if no session exists (for server-side use)
 */
export async function getCurrentUserId(): Promise<string> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized: No active session')
  }
  return session.userId
}

/**
 * Helper to build a query with user_id filter
 * Usage: const query = await withUserId(db.from('leads'))
 */
export async function withUserId<T>(
  queryBuilder: ReturnType<typeof db.from>
) {
  const userId = await getCurrentUserId()
  return queryBuilder.eq('user_id', userId)
}

/**
 * Get all leads for the current user
 */
export async function getUserLeads() {
  const userId = await getCurrentUserId()
  return db
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

/**
 * Get a single lead by ID (ensures it belongs to current user)
 */
export async function getUserLead(leadId: string) {
  const userId = await getCurrentUserId()
  return db
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single()
}

/**
 * Create a lead for the current user
 */
export async function createUserLead(data: {
  name: string
  phone: string
  status: string
  source: string
  summary?: string
  ai_summary?: string
  sentiment?: string
}) {
  const userId = await getCurrentUserId()
  return db
    .from('leads')
    .insert({
      ...data,
      user_id: userId,
    })
    .select()
    .single()
}

/**
 * Update a lead (ensures it belongs to current user)
 */
export async function updateUserLead(leadId: string, data: Partial<{
  name: string
  phone: string
  status: string
  summary: string
  ai_summary: string
  sentiment: string
}>) {
  const userId = await getCurrentUserId()
  return db
    .from('leads')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('user_id', userId)
    .select()
    .single()
}

/**
 * Get all call logs for the current user
 */
export async function getUserCallLogs() {
  const userId = await getCurrentUserId()
  return db
    .from('call_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

/**
 * Create a call log for the current user
 */
export async function createUserCallLog(data: {
  phone: string
  recording_url?: string
  duration?: number
  sentiment?: string
  summary?: string
}) {
  const userId = await getCurrentUserId()
  return db
    .from('call_logs')
    .insert({
      ...data,
      user_id: userId,
    })
    .select()
    .single()
}

/**
 * Get all contacts for the current user
 */
export async function getUserContacts() {
  const userId = await getCurrentUserId()
  return db
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

/**
 * Create a contact for the current user
 */
export async function createUserContact(data: {
  first_name: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  job_position?: string
  status?: string
  notes?: string
}) {
  const userId = await getCurrentUserId()
  return db
    .from('contacts')
    .insert({
      ...data,
      user_id: userId,
    })
    .select()
    .single()
}

/**
 * Get dashboard statistics for the current user
 */
export async function getUserDashboardStats() {
  const userId = await getCurrentUserId()

  // Get counts in parallel
  const [leadsResult, callLogsResult, contactsResult] = await Promise.all([
    db
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    db
      .from('call_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    db
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ])

  // Get leads by status
  const leadsByStatus = await db
    .from('leads')
    .select('status')
    .eq('user_id', userId)

  const statusCounts = leadsByStatus.data?.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  return {
    totalLeads: leadsResult.count || 0,
    totalCalls: callLogsResult.count || 0,
    totalContacts: contactsResult.count || 0,
    leadsByStatus: statusCounts,
  }
}
