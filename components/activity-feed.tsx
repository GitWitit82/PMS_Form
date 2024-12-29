import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { ActivityType, ActivityAction } from '@/lib/activity-logger'

interface Activity {
  activity_id: number
  type: ActivityType
  entity_type: string
  entity_id: number
  action: ActivityAction
  details: Record<string, any>
  created_at: string
  user: {
    username: string
    email: string
  }
}

interface ActivityFeedProps {
  userId?: number
  entityType?: string
  entityId?: number
  limit?: number
  className?: string
}

/**
 * A component that displays a feed of user activities
 */
export function ActivityFeed({
  userId,
  entityType,
  entityId,
  limit = 10,
  className = '',
}: ActivityFeedProps) {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (userId) params.append('userId', userId.toString())
        if (entityType) params.append('entityType', entityType)
        if (entityId) params.append('entityId', entityId.toString())
        if (limit) params.append('limit', limit.toString())

        const response = await fetch(`/api/activities?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }

        const data = await response.json()
        setActivities(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchActivities()
    }
  }, [session, userId, entityType, entityId, limit])

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'form':
        return '📝'
      case 'project':
        return '📊'
      case 'task':
        return '✅'
      case 'workflow':
        return '🔄'
      case 'user':
        return '👤'
      default:
        return '📌'
    }
  }

  const getActionColor = (action: ActivityAction) => {
    switch (action) {
      case 'create':
        return 'text-green-600'
      case 'update':
        return 'text-blue-600'
      case 'delete':
        return 'text-red-600'
      case 'complete':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    )
  }

  if (!activities.length) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No activities found
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity) => (
        <div
          key={activity.activity_id}
          className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="text-2xl">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.user.username}
              <span className={`ml-2 ${getActionColor(activity.action)}`}>
                {activity.action}
              </span>
              <span className="ml-2 text-gray-500">
                {activity.entity_type.toLowerCase()}
              </span>
            </p>
            {activity.details && Object.keys(activity.details).length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {JSON.stringify(activity.details)}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {format(new Date(activity.created_at), 'PPp')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 