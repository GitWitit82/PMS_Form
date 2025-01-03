import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface VerifyResult {
  isValid: boolean
  user: {
    id: string
    username: string
    email: string | null
    role: string
  } | null
}

/**
 * Verifies user credentials against the database
 * @param username - The username to verify
 * @param pin - The PIN to verify
 * @returns Object containing verification result and user data if successful
 */
export async function verifyCredentials(username: string, pin: string): Promise<VerifyResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { isValid: false, user: null }
    }

    const isValid = await bcryptjs.compare(pin, user.pin_hash)
    
    if (!isValid) {
      return { isValid: false, user: null }
    }

    return {
      isValid: true,
      user: {
        id: user.user_id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return { isValid: false, user: null }
  }
}

/**
 * Hash a PIN for storage
 */
export async function hashPin(pin: string): Promise<string> {
  return await bcryptjs.hash(pin, 10)
}

/**
 * Verify a PIN against its hash
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return await bcryptjs.compare(pin, hash)
}