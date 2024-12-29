/**
 * Tasks API Routes
 * Handles CRUD operations for tasks
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'

// Validation schema for creating/updating tasks
const taskSchema = z.object({
  project_id: z.number(),
  resource_id: z.number().optional(),
  department_id: z.number().optional(),
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  scheduled_start_time: z.string().optional(),
  scheduled_start_date: z.string().optional(),
  scheduled_end_time: z.string().optional(),
  scheduled_end_date: z.string().optional(),
  actual_start_time: z.string().optional(),
  actual_start_date: z.string().optional(),
  actual_end_time: z.string().optional(),
  actual_end_date: z.string().optional(),
  delay_duration: z.string().optional(),
  delay_reason: z.string().optional(),
  delay_status: z.string().optional(),
  completion_status: z.string().optional(),
  priority: z.string().optional(),
  status: z.string(),
})

/**
 * GET /api/tasks
 * Get all tasks with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const resourceId = searchParams.get('resourceId')
    const departmentId = searchParams.get('departmentId')

    const where: any = {}
    if (projectId) where.project_id = parseInt(projectId)
    if (status) where.status = status
    if (resourceId) where.resource_id = parseInt(resourceId)
    if (departmentId) where.department_id = parseInt(departmentId)

    const tasks = await prisma.task.findMany({
      where,
      include: {
        Project: true,
        Resource: true,
        Department: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return Response.json(successResponse(tasks))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const validatedData = taskSchema.parse(body)

    // Convert date strings to Date objects
    const dateFields = [
      'scheduled_start_time',
      'scheduled_start_date',
      'scheduled_end_time',
      'scheduled_end_date',
      'actual_start_time',
      'actual_start_date',
      'actual_end_time',
      'actual_end_date',
    ]

    const data: any = { ...validatedData }
    dateFields.forEach((field) => {
      if (data[field]) {
        data[field] = new Date(data[field])
      }
    })

    const task = await prisma.task.create({
      data,
      include: {
        Project: true,
        Resource: true,
        Department: true,
      },
    })

    return Response.json(successResponse(task), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(new ApiError('VALIDATION_ERROR', 'Invalid task data', error.errors)),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PUT /api/tasks
 * Bulk update tasks
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const { tasks } = body

    if (!Array.isArray(tasks)) {
      throw new ApiError('VALIDATION_ERROR', 'Tasks must be an array')
    }

    const dateFields = [
      'scheduled_start_time',
      'scheduled_start_date',
      'scheduled_end_time',
      'scheduled_end_date',
      'actual_start_time',
      'actual_start_date',
      'actual_end_time',
      'actual_end_date',
    ]

    const updatedTasks = await Promise.all(
      tasks.map((task) => {
        const data: any = { ...task }
        dateFields.forEach((field) => {
          if (data[field]) {
            data[field] = new Date(data[field])
          }
        })

        return prisma.task.update({
          where: { task_id: task.task_id },
          data,
          include: {
            Project: true,
            Resource: true,
            Department: true,
          },
        })
      })
    )

    return Response.json(successResponse(updatedTasks))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 