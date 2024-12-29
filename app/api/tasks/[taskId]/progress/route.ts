import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const progressUpdateSchema = z.object({
  percentage: z.number().min(0).max(100),
})

/**
 * PATCH /api/tasks/[taskId]/progress
 * Update a task's progress percentage
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
    const { percentage } = progressUpdateSchema.parse(json)

    // Get the current task
    const currentTask = await prisma.task.findUnique({
      where: {
        task_id: parseInt(params.taskId),
      },
      select: {
        completion_percentage: true,
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
      completion_percentage: percentage,
      updated_by: session.user.id,
    }

    // Set actual start date if progress is started
    if (
      percentage > 0 &&
      currentTask.completion_percentage === 0 &&
      !currentTask.actual_start_date
    ) {
      updateData.actual_start_date = new Date()
      updateData.status = 'In Progress'
    }

    // Set actual end date and update status if progress is 100%
    if (
      percentage === 100 &&
      currentTask.completion_percentage < 100 &&
      !currentTask.actual_end_date
    ) {
      updateData.actual_end_date = new Date()
      updateData.status = 'Completed'
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
      action: 'progress_update',
      details: `Progress updated from ${currentTask.completion_percentage}% to ${percentage}%`,
      user_id: session.user.id,
    })

    return successResponse({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }
    console.error('Error updating task progress:', error)
    return errorResponse('Error updating task progress')
  }
} 