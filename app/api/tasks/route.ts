/**
 * Tasks API Routes
 * Handles CRUD operations for tasks
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  project_id: z.number({
    required_error: 'Project is required',
  }),
  resource_id: z.number().optional().nullable(),
  department_id: z.number().optional().nullable(),
  scheduled_start_date: z.string().optional().nullable(),
  scheduled_end_date: z.string().optional().nullable(),
  scheduled_start_time: z.string().optional().nullable(),
  scheduled_end_time: z.string().optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
})

/**
 * GET /api/tasks
 * Retrieve all tasks with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const resourceId = searchParams.get('resourceId')
    const departmentId = searchParams.get('departmentId')

    const where: any = {}

    if (projectId) {
      where.project_id = parseInt(projectId)
    }
    if (status) {
      where.status = status
    }
    if (priority) {
      where.priority = priority
    }
    if (resourceId) {
      where.resource_id = parseInt(resourceId)
    }
    if (departmentId) {
      where.department_id = parseInt(departmentId)
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        Project: {
          select: {
            name: true,
          },
        },
        Resource: {
          select: {
            name: true,
            Department: {
              select: {
                name: true,
              },
            },
          },
        },
        Department: {
          select: {
            name: true,
          },
        },
        Dependencies: {
          include: {
            DependentTask: {
              select: {
                name: true,
                status: true,
                Project: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return successResponse({ tasks })
  } catch (error) {
    console.error('Error retrieving tasks:', error)
    return errorResponse('Error retrieving tasks')
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const json = await request.json()
    const validatedData = taskSchema.parse(json)

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        completion_percentage: 0,
        created_by: session.user.id,
      },
      include: {
        Project: {
          select: {
            name: true,
          },
        },
        Resource: {
          select: {
            name: true,
            Department: {
              select: {
                name: true,
              },
            },
          },
        },
        Department: {
          select: {
            name: true,
          },
        },
      },
    })

    await logActivity({
      entity_type: 'task',
      entity_id: task.task_id,
      action: 'create',
      details: 'Task created',
      user_id: session.user.id,
    })

    return successResponse({ task }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }
    console.error('Error creating task:', error)
    return errorResponse('Error creating task')
  }
} 