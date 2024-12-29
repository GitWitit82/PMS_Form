import { prisma } from '@/lib/prisma'

export type ActivityType = 'form' | 'project' | 'task' | 'workflow' | 'user'
export type ActivityAction = 'create' | 'update' | 'delete' | 'complete' | 'start' | 'pause' | 'resume'

interface LogActivityParams {
  userId: number
  type: ActivityType
  entityType: string
  entityId: number
  action: ActivityAction
  details?: Record<string, any>
}

/**
 * Logs a user activity in the system
 * @param params The activity parameters including user ID, type, entity details, and action
 * @returns The created activity record
 */
export async function logActivity(params: LogActivityParams) {
  const { userId, type, entityType, entityId, action, details = {} } = params

  try {
    const activity = await prisma.activity.create({
      data: {
        user_id: userId,
        type,
        entity_type: entityType,
        entity_id: entityId,
        action,
        details,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    })

    return activity
  } catch (error) {
    console.error('Error logging activity:', error)
    throw new Error('Failed to log activity')
  }
}

/**
 * Retrieves activities for a specific user
 * @param userId The ID of the user
 * @param limit The maximum number of activities to retrieve
 * @returns An array of activity records
 */
export async function getUserActivities(userId: number, limit = 10) {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })

    return activities
  } catch (error) {
    console.error('Error retrieving user activities:', error)
    throw new Error('Failed to retrieve user activities')
  }
}

/**
 * Retrieves activities for a specific entity
 * @param entityType The type of entity (e.g., 'form', 'project')
 * @param entityId The ID of the entity
 * @param limit The maximum number of activities to retrieve
 * @returns An array of activity records
 */
export async function getEntityActivities(entityType: string, entityId: number, limit = 10) {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })

    return activities
  } catch (error) {
    console.error('Error retrieving entity activities:', error)
    throw new Error('Failed to retrieve entity activities')
  }
} 