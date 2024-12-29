/**
 * Projects API Routes
 * Handles CRUD operations for projects
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'

// Validation schema for creating/updating projects
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  customer_id: z.number(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'On Hold']),
})

/**
 * GET /api/projects
 * Get all projects with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: any = {}
    if (status) where.status = status
    if (customerId) where.customer_id = parseInt(customerId)

    const projects = await prisma.project.findMany({
      where,
      include: {
        Customer: true,
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

    return Response.json(successResponse(projects))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        start_date: validatedData.start_date ? new Date(validatedData.start_date) : null,
        end_date: validatedData.end_date ? new Date(validatedData.end_date) : null,
      },
      include: {
        Customer: true,
      },
    })

    return Response.json(successResponse(project), { status: 201 })
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
 * PUT /api/projects
 * Bulk update projects
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const { projects } = body

    if (!Array.isArray(projects)) {
      throw new ApiError('VALIDATION_ERROR', 'Projects must be an array')
    }

    const updatedProjects = await Promise.all(
      projects.map((project) =>
        prisma.project.update({
          where: { project_id: project.project_id },
          data: {
            ...project,
            start_date: project.start_date ? new Date(project.start_date) : null,
            end_date: project.end_date ? new Date(project.end_date) : null,
          },
        })
      )
    )

    return Response.json(successResponse(updatedProjects))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 