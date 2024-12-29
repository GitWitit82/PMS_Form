import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/tasks/[taskId]/history
 * Retrieve the history of changes for a task
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

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : undefined
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!)
      : undefined

    // Get the task history
    const history = await prisma.taskHistory.findMany({
      where: {
        task_id: parseInt(params.taskId),
      },
      include: {
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get the total count
    const totalCount = await prisma.taskHistory.count({
      where: {
        task_id: parseInt(params.taskId),
      },
    })

    return successResponse({
      history,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Error retrieving task history:', error)
    return errorResponse('Error retrieving task history')
  }
}

/**
 * POST /api/tasks/[taskId]/history
 * Add a new history entry for a task
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
    const { action_type, field_name, old_value, new_value } = json

    // Create the history entry
    const historyEntry = await prisma.taskHistory.create({
      data: {
        task_id: parseInt(params.taskId),
        action_type,
        field_name,
        old_value,
        new_value,
        created_by: session.user.id,
      },
      include: {
        User: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    })

    return successResponse({ historyEntry }, 201)
  } catch (error) {
    console.error('Error creating task history entry:', error)
    return errorResponse('Error creating task history entry')
  }
} 