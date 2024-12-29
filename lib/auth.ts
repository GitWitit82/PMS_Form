import bcrypt from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        pin: { label: 'PIN', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.pin) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.pin, user.pin_hash)

        if (!isValid) {
          return null
        }

        return {
          id: user.user_id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.username = token.username as string
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
}

/**
 * Validates if the input is a 4-digit PIN
 */
export const isValidPin = (pin: string): boolean => {
  return /^\d{4}$/.test(pin)
}

/**
 * Hashes a PIN for secure storage
 */
export const hashPin = async (pin: string): Promise<string> => {
  return await bcrypt.hash(pin, 10)
}

/**
 * Validates user credentials
 */
export const validateCredentials = (
  username: string,
  pin: string
): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: 'Username is required' }
  }

  if (!isValidPin(pin)) {
    return { isValid: false, error: 'PIN must be exactly 4 digits' }
  }

  return { isValid: true }
} 