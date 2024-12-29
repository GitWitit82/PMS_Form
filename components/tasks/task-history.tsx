'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react'

interface TaskHistory {
  history_id: number
  task_id: number
  action_type: string
  field_name: string
  old_value?: string | null
  new_value?: string | null
  created_at: Date
  User: {
    user_id: number
    name: string
  }
}

interface TaskHistoryProps {
  history: TaskHistory[]
}

/**
 * A component that displays the history of changes made to a task
 */
export function TaskHistory({ history }: TaskHistoryProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'status_change':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'progress_update':
        return <ClockIcon className="h-4 w-4" />
      case 'dependency_added':
      case 'dependency_removed':
        return <ArrowRightIcon className="h-4 w-4" />
      case 'delay_reported':
        return <AlertCircleIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'status_change':
        return 'text-green-600'
      case 'progress_update':
        return 'text-blue-600'
      case 'dependency_added':
      case 'dependency_removed':
        return 'text-purple-600'
      case 'delay_reported':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatValue = (value: string | null) => {
    if (!value) return 'None'
    if (value === 'true') return 'Yes'
    if (value === 'false') return 'No'
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          Track changes and updates made to this task
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No history available
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => (
              <div
                key={entry.history_id}
                className="flex items-start space-x-4"
              >
                <div
                  className={`mt-1 p-2 rounded-full ${getActionColor(
                    entry.action_type
                  )} bg-opacity-10`}
                >
                  {getActionIcon(entry.action_type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {formatFieldName(entry.field_name)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'PPp')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    {entry.old_value && (
                      <>
                        <span className="text-muted-foreground">
                          {formatValue(entry.old_value)}
                        </span>
                        <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
                      </>
                    )}
                    <span>{formatValue(entry.new_value)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <UserIcon className="h-3 w-3" />
                    <span>{entry.User.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 