/**
 * Individual User API Routes
 * Handles operations for single users
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

// Validation schema for updating users
const userUpdateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  pin: z.string().min(4, 'PIN must be at least 4 characters').optional(),
  role: z.enum([UserRole.ADMIN, UserRole.STAFF, UserRole.PROJECT_MGT, UserRole.CEO]).optional(),
})

/**
 * GET /api/users/[userId]
 * Get a single user by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const userId = parseInt(params.userId)
    if (isNaN(userId)) {
      throw new ApiError('INVALID_ID', 'Invalid user ID')
    }

    // Users can only view their own profile unless they're an admin
    if (session.user?.role !== UserRole.ADMIN && session.user?.id !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only view your own profile')
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
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
    })

    if (!user) {
      throw new ApiError('NOT_FOUND', 'User not found')
    }

    return Response.json(successResponse(user))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PATCH /api/users/[userId]
 * Update a single user
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const userId = parseInt(params.userId)
    if (isNaN(userId)) {
      throw new ApiError('INVALID_ID', 'Invalid user ID')
    }

    // Users can only update their own profile unless they're an admin
    if (session.user?.role !== UserRole.ADMIN && session.user?.id !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only update your own profile')
    }

    const body = await req.json()
    const validatedData = userUpdateSchema.parse(body)

    // Check if username or email already exists
    if (validatedData.username || validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            validatedData.username ? { username: validatedData.username } : null,
            validatedData.email ? { email: validatedData.email } : null,
          ].filter(Boolean),
          NOT: {
            user_id: userId,
          },
        },
      })

      if (existingUser) {
        throw new ApiError(
          'DUPLICATE_ENTRY',
          'Username or email already exists'
        )
      }
    }

    const updateData: any = {
      ...validatedData,
      updated_at: new Date(),
    }

    // Only hash the PIN if it's being updated
    if (validatedData.pin) {
      updateData.pin_hash = await bcrypt.hash(validatedData.pin, 10)
      delete updateData.pin
    }

    const user = await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
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
    })

    return Response.json(successResponse(user))
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
 * DELETE /api/users/[userId]
 * Delete a single user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    // Only admins can delete users
    if (session.user?.role !== UserRole.ADMIN) {
      throw new ApiError('FORBIDDEN', 'Only administrators can delete users')
    }

    const userId = parseInt(params.userId)
    if (isNaN(userId)) {
      throw new ApiError('INVALID_ID', 'Invalid user ID')
    }

    await prisma.user.delete({
      where: { user_id: userId },
    })

    return Response.json(successResponse({ message: 'User deleted successfully' }))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 