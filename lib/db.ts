import { PrismaClient } from '@prisma/client'

/**
 * Global PrismaClient instance to be used across the application
 * This ensures we don't create multiple instances of PrismaClient in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db 