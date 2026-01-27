/**
 * Encryption utilities for sensitive data
 * Uses Node.js crypto module for AES-256-GCM encryption
 * 
 * IMPORTANT: Set ENCRYPTION_KEY environment variable (32-byte hex string)
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

// Get encryption key from environment
// Should be a 32-byte (64 hex characters) key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error(
    'ENCRYPTION_KEY environment variable is required. ' +
    'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  )
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)')
}

// Derive a key from the encryption key using scrypt
async function getKey(): Promise<Buffer> {
  const salt = Buffer.from('scalemako-salt-v1', 'utf8') // Fixed salt for consistency
  return (await scryptAsync(ENCRYPTION_KEY, salt, 32)) as Buffer
}

/**
 * Encrypts a string using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encryptedData (all base64)
 */
export async function encrypt(text: string): Promise<string> {
  if (!text) {
    throw new Error('Cannot encrypt empty string')
  }

  const key = await getKey()
  const iv = randomBytes(16) // Initialization vector
  const cipher = createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  
  const authTag = cipher.getAuthTag()

  // Return format: iv:authTag:encryptedData (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`
}

/**
 * Decrypts a string encrypted with encrypt()
 * @param encryptedText - Encrypted string in format: iv:authTag:encryptedData
 * @returns Decrypted plain text
 */
export async function decrypt(encryptedText: string): Promise<string> {
  if (!encryptedText) {
    throw new Error('Cannot decrypt empty string')
  }

  const parts = encryptedText.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected: iv:authTag:encryptedData')
  }

  const [ivBase64, authTagBase64, encrypted] = parts
  const iv = Buffer.from(ivBase64, 'base64')
  const authTag = Buffer.from(authTagBase64, 'base64')

  const key = await getKey()
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Hashes an API key for verification (one-way, cannot be decrypted)
 * Useful for checking if a key matches without storing the plain text
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  const { createHash } = await import('crypto')
  return createHash('sha256').update(apiKey).digest('hex')
}
