'use server'

/**
 * Server Action to securely save API keys
 * Encrypts the key before storing in database
 */

import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'
import { getSession } from '@/lib/session'

export interface SaveApiKeyResult {
  success: boolean
  error?: string
  message?: string
}

/**
 * Saves an encrypted API key for a service
 * @param service - Service name (e.g., 'vapi', 'twilio', 'make')
 * @param apiKey - Plain text API key (will be encrypted)
 */
export async function saveApiKey(
  service: string,
  apiKey: string
): Promise<SaveApiKeyResult> {
  try {
    // Get current user session
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.',
      }
    }

    // Validate inputs
    if (!service || !apiKey) {
      return {
        success: false,
        error: 'Service name and API key are required',
      }
    }

    // Validate service name
    const validServices = ['vapi', 'twilio', 'make', 'hubspot', 'salesforce', 'pipedrive', 'zoho', 'monday']
    if (!validServices.includes(service.toLowerCase())) {
      return {
        success: false,
        error: `Invalid service name. Must be one of: ${validServices.join(', ')}`,
      }
    }

    // Encrypt the API key
    const encryptedKey = await encrypt(apiKey.trim())

    // Check if API key already exists for this user and service
    const { data: existing } = await db
      .from('api_keys')
      .select('id')
      .eq('user_id', session.userId)
      .eq('service_name', service.toLowerCase())
      .single()

    if (existing) {
      // Update existing key
      const { error } = await db
        .from('api_keys')
        .update({
          encrypted_key: encryptedKey,
          updated_at: new Date().toISOString(),
          is_active: true,
        })
        .eq('id', existing.id)
        .eq('user_id', session.userId)

      if (error) {
        console.error('Error updating API key:', error)
        return {
          success: false,
          error: 'Failed to update API key. Please try again.',
        }
      }

      return {
        success: true,
        message: `${service} API key updated successfully`,
      }
    } else {
      // Insert new key
      const { error } = await db
        .from('api_keys')
        .insert({
          user_id: session.userId,
          service_name: service.toLowerCase(),
          encrypted_key: encryptedKey,
          is_active: true,
        })

      if (error) {
        console.error('Error saving API key:', error)
        return {
          success: false,
          error: 'Failed to save API key. Please try again.',
        }
      }

      return {
        success: true,
        message: `${service} API key saved successfully`,
      }
    }
  } catch (error: any) {
    console.error('Error in saveApiKey:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Retrieves and decrypts an API key for a service
 * @param service - Service name
 * @returns Decrypted API key or null if not found
 */
export async function getApiKey(service: string): Promise<string | null> {
  try {
    const session = await getSession()
    if (!session) {
      return null
    }

    const { data, error } = await db
      .from('api_keys')
      .select('encrypted_key')
      .eq('user_id', session.userId)
      .eq('service_name', service.toLowerCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    // Decrypt the key
    const { decrypt } = await import('@/lib/encryption')
    const decrypted = await decrypt(data.encrypted_key)
    return decrypted
  } catch (error) {
    console.error('Error retrieving API key:', error)
    return null
  }
}

/**
 * Deletes (deactivates) an API key for a service
 */
export async function deleteApiKey(service: string): Promise<SaveApiKeyResult> {
  try {
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized. Please log in.',
      }
    }

    const { error } = await db
      .from('api_keys')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.userId)
      .eq('service_name', service.toLowerCase())

    if (error) {
      console.error('Error deleting API key:', error)
      return {
        success: false,
        error: 'Failed to delete API key. Please try again.',
      }
    }

    return {
      success: true,
      message: `${service} API key deleted successfully`,
    }
  } catch (error: any) {
    console.error('Error in deleteApiKey:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}
