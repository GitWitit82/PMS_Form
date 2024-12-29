import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

const dependencySchema = z.object({
  dependent_task_id: z.string().min(1, 'Dependent task is required'),
  dependency_type: z.enum([
    'Finish to Start',
    'Start to Start',
    'Finish to Finish',
    'Start to Finish',
  ]),
})

/**
 * GET /api/tasks/[taskId]/dependencies
 * Retrieve all dependencies for a task
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

    const dependencies = await prisma.taskDependency.findMany({
      where: {
        task_id: parseInt(params.taskId),
      },
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
      orderBy: {
        created_at: 'desc',
      },
    })

    return successResponse({ dependencies })
  } catch (error) {
    console.error('Error retrieving task dependencies:', error)
    return errorResponse('Error retrieving task dependencies')
  }
}

/**
 * POST /api/tasks/[taskId]/dependencies
 * Add a new dependency to a task
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const json = await request.json()
    const { dependent_task_id, dependency_type } = dependencySchema.parse(
      json
    )

    // Check if the task exists
    const task = await prisma.task.findUnique({
      where: {
        task_id: parseInt(params.taskId),
      },
    })

    if (!task) {
      return errorResponse('Task not found', 404)
    }

    // Check if the dependent task exists
    const dependentTask = await prisma.task.findUnique({
      where: {
        task_id: parseInt(dependent_task_id),
      },
    })

    if (!dependentTask) {
      return errorResponse('Dependent task not found', 404)
    }

    // Check for circular dependencies
    const hasCircularDependency = await checkCircularDependency(
      parseInt(params.taskId),
      parseInt(dependent_task_id)
    )

    if (hasCircularDependency) {
      return errorResponse(
        'Cannot add dependency: would create a circular dependency',
        400
      )
    }

    // Create the dependency
    const dependency = await prisma.taskDependency.create({
      data: {
        task_id: parseInt(params.taskId),
        dependent_task_id: parseInt(dependent_task_id),
        dependency_type,
        created_by: session.user.id,
      },
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
    })

    await logActivity({
      entity_type: 'task',
      entity_id: parseInt(params.taskId),
      action: 'dependency_added',
      details: `Added dependency on task ${dependentTask.name}`,
      user_id: session.user.id,
    })

    return successResponse({ dependency }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message, 400)
    }
    console.error('Error creating task dependency:', error)
    return errorResponse('Error creating task dependency')
  }
}

/**
 * Helper function to check for circular dependencies
 */
async function checkCircularDependency(
  taskId: number,
  dependentTaskId: number,
  visited = new Set<number>()
): Promise<boolean> {
  if (visited.has(taskId)) {
    return taskId === dependentTaskId
  }

  visited.add(taskId)

  const dependencies = await prisma.taskDependency.findMany({
    where: {
      task_id: taskId,
    },
    select: {
      dependent_task_id: true,
    },
  })

  for (const dep of dependencies) {
    if (
      await checkCircularDependency(
        dep.dependent_task_id,
        dependentTaskId,
        visited
      )
    ) {
      return true
    }
  }

  return false
} 