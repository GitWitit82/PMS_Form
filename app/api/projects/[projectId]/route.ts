/**
 * Individual Project API Routes
 * Handles operations for single projects
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'

// Validation schema for updating projects
const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  customer_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'On Hold']).optional(),
})

/**
 * GET /api/projects/[projectId]
 * Get a single project by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      throw new ApiError('INVALID_ID', 'Invalid project ID')
    }

    const project = await prisma.project.findUnique({
      where: { project_id: projectId },
      include: {
        Customer: true,
        Task: {
          include: {
            Resource: true,
            Department: true,
          },
        },
      },
    })

    if (!project) {
      throw new ApiError('NOT_FOUND', 'Project not found')
    }

    return Response.json(successResponse(project))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PATCH /api/projects/[projectId]
 * Update a single project
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      throw new ApiError('INVALID_ID', 'Invalid project ID')
    }

    const body = await req.json()
    const validatedData = projectUpdateSchema.parse(body)

    const project = await prisma.project.update({
      where: { project_id: projectId },
      data: {
        ...validatedData,
        start_date: validatedData.start_date ? new Date(validatedData.start_date) : undefined,
        end_date: validatedData.end_date ? new Date(validatedData.end_date) : undefined,
      },
      include: {
        Customer: true,
        Task: {
          include: {
            Resource: true,
            Department: true,
          },
        },
      },
    })

    return Response.json(successResponse(project))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(
          new ApiError('VALIDATION_ERROR', 'Invalid project data', error.errors)
        ),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * DELETE /api/projects/[projectId]
 * Delete a single project
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      throw new ApiError('INVALID_ID', 'Invalid project ID')
    }

    await prisma.project.delete({
      where: { project_id: projectId },
    })

    return Response.json(successResponse({ message: 'Project deleted successfully' }))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 