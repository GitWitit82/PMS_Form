/**
 * Activities API Routes
 * Handles logging and retrieving user activities
 */
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logActivity, getUserActivities, getEntityActivities } from '@/lib/activity-logger'
import { successResponse, errorResponse } from '@/lib/api-response'

const activitySchema = z.object({
  type: z.enum(['form', 'project', 'task', 'workflow', 'user']),
  entityType: z.string(),
  entityId: z.number(),
  action: z.enum(['create', 'update', 'delete', 'complete', 'start', 'pause', 'resume']),
  details: z.record(z.any()).optional(),
})

/**
 * GET /api/activities
 * Retrieves activities based on query parameters
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const limit = parseInt(searchParams.get('limit') || '10')

    let activities

    if (userId) {
      activities = await getUserActivities(parseInt(userId), limit)
    } else if (entityType && entityId) {
      activities = await getEntityActivities(entityType, parseInt(entityId), limit)
    } else {
      return errorResponse(400, 'Missing required query parameters')
    }

    return successResponse(activities)
  } catch (error) {
    console.error('Error retrieving activities:', error)
    return errorResponse(500, 'Failed to retrieve activities')
  }
}

/**
 * POST /api/activities
 * Creates a new activity log
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse(401, 'Unauthorized')
    }

    const body = await request.json()
    const validatedData = activitySchema.parse(body)

    const activity = await logActivity({
      userId: session.user.id,
      ...validatedData,
    })

    return successResponse(activity)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(400, 'Invalid request data', error.errors)
    }
    console.error('Error creating activity:', error)
    return errorResponse(500, 'Failed to create activity')
  }
} 