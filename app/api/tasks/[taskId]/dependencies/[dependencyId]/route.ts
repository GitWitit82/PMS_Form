import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

/**
 * GET /api/tasks/[taskId]/dependencies/[dependencyId]
 * Retrieve a specific task dependency
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string; dependencyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const dependency = await prisma.taskDependency.findUnique({
      where: {
        dependency_id: parseInt(params.dependencyId),
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
    })

    if (!dependency) {
      return errorResponse('Task dependency not found', 404)
    }

    return successResponse({ dependency })
  } catch (error) {
    console.error('Error retrieving task dependency:', error)
    return errorResponse('Error retrieving task dependency')
  }
}

/**
 * DELETE /api/tasks/[taskId]/dependencies/[dependencyId]
 * Delete a specific task dependency
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string; dependencyId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    // Get the dependency before deleting it
    const dependency = await prisma.taskDependency.findUnique({
      where: {
        dependency_id: parseInt(params.dependencyId),
        task_id: parseInt(params.taskId),
      },
      include: {
        DependentTask: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!dependency) {
      return errorResponse('Task dependency not found', 404)
    }

    // Delete the dependency
    await prisma.taskDependency.delete({
      where: {
        dependency_id: parseInt(params.dependencyId),
        task_id: parseInt(params.taskId),
      },
    })

    await logActivity({
      entity_type: 'task',
      entity_id: parseInt(params.taskId),
      action: 'dependency_removed',
      details: `Removed dependency on task ${dependency.DependentTask.name}`,
      user_id: session.user.id,
    })

    return successResponse({
      message: 'Task dependency deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting task dependency:', error)
    return errorResponse('Error deleting task dependency')
  }
} 