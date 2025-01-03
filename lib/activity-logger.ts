/**
 * Activity Logger Utility
 * Handles logging of user activities in the system
 */

export enum ActivityType {
  PROJECT = 'PROJECT',
  WORKFLOW = 'WORKFLOW',
  TASK = 'TASK',
  FORM = 'FORM',
  USER = 'USER'
}

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  COMPLETE = 'COMPLETE',
  START = 'START'
}

export interface Activity {
  activity_id: number
  user_id: number
  type: ActivityType
  entity_type: string
  entity_id: number
  action: ActivityAction
  details: Record<string, any>
  created_at: Date
}

/**
 * Logs an activity in the system
 */
export async function logActivity(
  userId: number,
  type: ActivityType,
  entityType: string,
  entityId: number,
  action: ActivityAction,
  details: Record<string, any> = {}
) {
  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        entityType,
        entityId,
        action,
        details
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to log activity')
    }
  } catch (error) {
    console.error('Error logging activity:', error)
    // We don't throw here as activity logging is not critical
  }
} 