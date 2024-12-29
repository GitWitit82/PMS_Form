/**
 * Individual Project API Routes
 * Handles operations for single projects
 */
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  customer_id: z.number().optional(),
  start_date: z.string().datetime().optional().nullable(),
  end_date: z.string().datetime().optional().nullable(),
  status: z.enum(['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled']).optional(),
})

/**
 * GET /api/projects/[projectId]
 * Get a single project by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      return errorResponse(400, 'Invalid project ID')
    }

    const project = await prisma.project.findUnique({
      where: { project_id: projectId },
      include: {
        Customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Task: {
          select: {
            task_id: true,
            name: true,
            status: true,
            Resource: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    if (!project) {
      return errorResponse(404, 'Project not found')
    }

    return successResponse(project)
  } catch (error) {
    console.error('Error retrieving project:', error)
    return errorResponse(500, 'Failed to retrieve project')
  }
}

/**
 * PATCH /api/projects/[projectId]
 * Update a single project
 */
export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      return errorResponse(400, 'Invalid project ID')
    }

    const body = await request.json()
    const validatedData = projectUpdateSchema.parse(body)

    // Convert dates if they exist
    const updateData = {
      ...validatedData,
      start_date: validatedData.start_date
        ? new Date(validatedData.start_date)
        : undefined,
      end_date: validatedData.end_date
        ? new Date(validatedData.end_date)
        : undefined,
    }

    const project = await prisma.project.update({
      where: { project_id: projectId },
      data: updateData,
      include: {
        Customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Task: {
          select: {
            task_id: true,
            name: true,
            status: true,
            Resource: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    return successResponse(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(400, 'Invalid request data', error.errors)
    }
    console.error('Error updating project:', error)
    return errorResponse(500, 'Failed to update project')
  }
}

/**
 * DELETE /api/projects/[projectId]
 * Delete a single project
 */
export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      return errorResponse(400, 'Invalid project ID')
    }

    await prisma.project.delete({
      where: { project_id: projectId },
    })

    return successResponse({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return errorResponse(500, 'Failed to delete project')
  }
} 