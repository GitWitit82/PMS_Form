/**
 * Users API Routes
 * Handles user management and activity logging
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

// Validation schema for creating/updating users
const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  pin: z.string().min(4, 'PIN must be at least 4 characters'),
  role: z.enum([UserRole.ADMIN, UserRole.STAFF, UserRole.PROJECT_MGT, UserRole.CEO]),
})

/**
 * GET /api/users
 * Get all users with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    // Only admins can list users
    if (session.user?.role !== UserRole.ADMIN) {
      throw new ApiError('FORBIDDEN', 'Only administrators can access user list')
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role') as UserRole | null

    const where: any = {}
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        resource: {
          select: {
            resource_id: true,
            name: true,
            department_id: true,
            Department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return Response.json(successResponse(users))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    // Only admins can create users
    if (session.user?.role !== UserRole.ADMIN) {
      throw new ApiError('FORBIDDEN', 'Only administrators can create users')
    }

    const body = await req.json()
    const validatedData = userSchema.parse(body)

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email },
        ],
      },
    })

    if (existingUser) {
      throw new ApiError(
        'DUPLICATE_ENTRY',
        'Username or email already exists'
      )
    }

    // Hash the PIN
    const hashedPin = await bcrypt.hash(validatedData.pin, 10)

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        pin_hash: hashedPin,
        role: validatedData.role,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    })

    return Response.json(successResponse(user), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(
          new ApiError('VALIDATION_ERROR', 'Invalid user data', error.errors)
        ),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PUT /api/users
 * Bulk update users
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    // Only admins can update users
    if (session.user?.role !== UserRole.ADMIN) {
      throw new ApiError('FORBIDDEN', 'Only administrators can update users')
    }

    const body = await req.json()
    const { users } = body

    if (!Array.isArray(users)) {
      throw new ApiError('VALIDATION_ERROR', 'Users must be an array')
    }

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const validatedData = userSchema.parse(user)
        const hashedPin = await bcrypt.hash(validatedData.pin, 10)

        return prisma.user.update({
          where: { user_id: user.user_id },
          data: {
            username: validatedData.username,
            email: validatedData.email,
            pin_hash: hashedPin,
            role: validatedData.role,
            updated_at: new Date(),
          },
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        })
      })
    )

    return Response.json(successResponse(updatedUsers))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(
          new ApiError('VALIDATION_ERROR', 'Invalid user data', error.errors)
        ),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 