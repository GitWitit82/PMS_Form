/**
 * Projects API Routes
 * Handles CRUD operations for projects
 */
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  customer_id: z.number({
    required_error: 'Customer is required',
  }),
  start_date: z.string().datetime().optional().nullable(),
  end_date: z.string().datetime().optional().nullable(),
  status: z.enum(['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
})

/**
 * GET /api/projects
 * Get all projects with optional filtering
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: any = {}
    if (status) where.status = status
    if (customerId) where.customer_id = parseInt(customerId)

    const projects = await prisma.project.findMany({
      where,
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
        Task: {
          select: {
            task_id: true,
            status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return successResponse(projects)
  } catch (error) {
    console.error('Error retrieving projects:', error)
    return errorResponse(500, 'Failed to retrieve projects')
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        start_date: validatedData.start_date ? new Date(validatedData.start_date) : null,
        end_date: validatedData.end_date ? new Date(validatedData.end_date) : null,
      },
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
      },
    })

    return successResponse(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(400, 'Invalid request data', error.errors)
    }
    console.error('Error creating project:', error)
    return errorResponse(500, 'Failed to create project')
  }
} 