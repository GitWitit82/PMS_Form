/**
 * Individual Task API Routes
 * Handles operations for single tasks
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const taskUpdateSchema = z.object({
  name: z.string().min(1, 'Task name is required').optional(),
  description: z.string().optional(),
  project_id: z.number().optional(),
  resource_id: z.number().optional().nullable(),
  department_id: z.number().optional().nullable(),
  scheduled_start_date: z.string().optional().nullable(),
  scheduled_end_date: z.string().optional().nullable(),
  scheduled_start_time: z.string().optional().nullable(),
  scheduled_end_time: z.string().optional().nullable(),
  actual_start_date: z.string().optional().nullable(),
  actual_end_date: z.string().optional().nullable(),
  actual_start_time: z.string().optional().nullable(),
  actual_end_time: z.string().optional().nullable(),
  delay_duration: z.string().optional().nullable(),
  delay_reason: z.string().optional().nullable(),
  delay_status: z.string().optional().nullable(),
  completion_status: z.string().optional().nullable(),
  completion_percentage: z.number().min(0).max(100).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  status: z.enum(['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled']).optional(),
})

/**
 * GET /api/tasks/[taskId]
 * Retrieve a specific task by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const task = await prisma.task.findUnique({
      where: {
        task_id: parseInt(params.taskId),
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
        Dependencies: {
          include: {
            DependentTask: {
              select: {
                task_id: true,
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
    })

    if (!task) {
      return errorResponse('Task not found', 404)
    }

    return successResponse({ task })
  } catch (error) {
    console.error('Error retrieving task:', error)
    return errorResponse('Error retrieving task')
  }
}

/**
 * PATCH /api/tasks/[taskId]
 * Update a specific task
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const json = await request.json()
    const validatedData = taskUpdateSchema.parse(json)

    const task = await prisma.task.update({
      where: {
        task_id: parseInt(params.taskId),
      },
      data: {
        ...validatedData,
        updated_by: session.user.id,
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
      action: 'update',
      details: 'Task updated',
      user_id: session.user.id,
    })

    return successResponse({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }
    console.error('Error updating task:', error)
    return errorResponse('Error updating task')
  }
}

/**
 * DELETE /api/tasks/[taskId]
 * Delete a specific task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const task = await prisma.task.delete({
      where: {
        task_id: parseInt(params.taskId),
      },
    })

    await logActivity({
      entity_type: 'task',
      entity_id: task.task_id,
      action: 'delete',
      details: 'Task deleted',
      user_id: session.user.id,
    })

    return successResponse({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return errorResponse('Error deleting task')
  }
} 