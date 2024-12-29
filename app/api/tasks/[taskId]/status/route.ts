import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const statusUpdateSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled']),
})

/**
 * PATCH /api/tasks/[taskId]/status
 * Update a task's status
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
    const { status } = statusUpdateSchema.parse(json)

    // Get the current task
    const currentTask = await prisma.task.findUnique({
      where: {
        task_id: parseInt(params.taskId),
      },
      select: {
        status: true,
        actual_start_date: true,
        actual_end_date: true,
      },
    })

    if (!currentTask) {
      return errorResponse('Task not found', 404)
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_by: session.user.id,
    }

    // Set actual start date when task moves to 'In Progress'
    if (
      status === 'In Progress' &&
      currentTask.status !== 'In Progress' &&
      !currentTask.actual_start_date
    ) {
      updateData.actual_start_date = new Date()
    }

    // Set actual end date when task is completed
    if (
      status === 'Completed' &&
      currentTask.status !== 'Completed' &&
      !currentTask.actual_end_date
    ) {
      updateData.actual_end_date = new Date()
      updateData.completion_percentage = 100
    }

    // Update the task
    const task = await prisma.task.update({
      where: {
        task_id: parseInt(params.taskId),
      },
      data: updateData,
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
      action: 'status_update',
      details: `Status updated from ${currentTask.status} to ${status}`,
      user_id: session.user.id,
    })

    return successResponse({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }
    console.error('Error updating task status:', error)
    return errorResponse('Error updating task status')
  }
} 