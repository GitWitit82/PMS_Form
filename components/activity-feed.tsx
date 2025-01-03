'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { ActivityType, ActivityAction, Activity as ActivityBase } from '@/lib/activity-logger'

interface Activity extends ActivityBase {
  user: {
    username: string
    email: string
  }
}

interface ActivityFeedProps {
  initialActivities?: Activity[]
}

export function ActivityFeed({ initialActivities = [] }: ActivityFeedProps) {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [loading, setLoading] = useState(!initialActivities.length)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!session?.user) return
      
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/activities')
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }

        const data = await response.json()
        setActivities(data.activities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching activities:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!initialActivities.length) {
      fetchActivities()
    }
  }, [session, initialActivities])

  const getActivityIcon = (type: ActivityType): string => {
    switch (type) {
      case ActivityType.FORM:
        return '📝'
      case ActivityType.PROJECT:
        return '📊'
      case ActivityType.TASK:
        return '✅'
      case ActivityType.WORKFLOW:
        return '🔄'
      case ActivityType.USER:
        return '👤'
      default:
        return '📌'
    }
  }

  const getActionColor = (action: ActivityAction): string => {
    switch (action) {
      case ActivityAction.CREATE:
        return 'text-green-600'
      case ActivityAction.UPDATE:
        return 'text-blue-600'
      case ActivityAction.DELETE:
        return 'text-red-600'
      case ActivityAction.COMPLETE:
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
    <div className="space-y-4">
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