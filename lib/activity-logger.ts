/**
 * Activity Logger Utility
 * Handles logging of user activities in the system
 */

interface ActivityLogParams {
  type: string
  entityType: string
  entityId: number
  action: string
  details?: Record<string, any>
}

/**
 * Logs an activity in the system
 */
export async function logActivity(params: ActivityLogParams): Promise<void> {
  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to log activity')
    }
  } catch (error) {
    console.error('Error logging activity:', error)
    // We don't throw here as activity logging is not critical
  }
} 