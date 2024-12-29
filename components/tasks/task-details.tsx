import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityFeed } from '@/components/activity-feed'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
  FlagIcon,
} from 'lucide-react'

interface TaskDetailsProps {
  task: {
    task_id: number
    name: string
    description?: string | null
    scheduled_start_date?: Date | null
    scheduled_end_date?: Date | null
    scheduled_start_time?: string | null
    scheduled_end_time?: string | null
    actual_start_date?: Date | null
    actual_end_date?: Date | null
    actual_start_time?: string | null
    actual_end_time?: string | null
    delay_duration?: string | null
    delay_reason?: string | null
    delay_status?: string | null
    completion_status?: string | null
    priority: string
    status: string
    created_at: Date
    Project: {
      project_id: number
      name: string
    }
    Resource?: {
      resource_id: number
      name: string
      Department?: {
        name: string
      } | null
    } | null
    Department?: {
      department_id: number
      name: string
    } | null
  }
  onEdit?: () => void
  onUpdateStatus?: (status: string) => Promise<void>
}

/**
 * A component that displays detailed task information
 */
export function TaskDetails({
  task,
  onEdit,
  onUpdateStatus,
}: TaskDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (time?: string | null) => {
    if (!time) return null
    return format(new Date(`2000-01-01T${time}`), 'h:mm a')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority} Priority
            </Badge>
            <span className="text-sm text-gray-500">
              Created on {format(new Date(task.created_at), 'PPP')}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {onUpdateStatus && task.status !== 'Completed' && task.status !== 'Cancelled' && (
            <Button
              variant="outline"
              className="bg-green-50 text-green-600 hover:bg-green-100"
              onClick={() => onUpdateStatus('Completed')}
            >
              Mark as Completed
            </Button>
          )}
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              Edit Task
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Scheduled
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {task.scheduled_start_date
                        ? format(new Date(task.scheduled_start_date), 'PPP')
                        : 'Not set'} -{' '}
                      {task.scheduled_end_date
                        ? format(new Date(task.scheduled_end_date), 'PPP')
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTime(task.scheduled_start_time) || 'Not set'} -{' '}
                      {formatTime(task.scheduled_end_time) || 'Not set'}
                    </span>
                  </div>
                </div>
              </div>

              {(task.actual_start_date || task.actual_end_date) && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Actual
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {task.actual_start_date
                          ? format(new Date(task.actual_start_date), 'PPP')
                          : 'Not started'} -{' '}
                        {task.actual_end_date
                          ? format(new Date(task.actual_end_date), 'PPP')
                          : 'Not completed'}
                      </span>
                    </div>
                    {(task.actual_start_time || task.actual_end_time) && (
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(task.actual_start_time) || 'Not started'} -{' '}
                          {formatTime(task.actual_end_time) || 'Not completed'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignment</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Project
                </div>
                <div className="text-sm font-medium">
                  {task.Project.name}
                </div>
              </div>

              {task.Resource && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Resource
                  </div>
                  <div className="text-sm font-medium">
                    {task.Resource.name}
                    {task.Resource.Department && (
                      <div className="text-sm text-muted-foreground">
                        {task.Resource.Department.name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {task.Department && !task.Resource?.Department && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Department
                  </div>
                  <div className="text-sm font-medium">
                    {task.Department.name}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <FlagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.completion_status && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Completion
                  </div>
                  <div className="text-sm font-medium">
                    {task.completion_status}
                  </div>
                </div>
              )}

              {task.delay_status && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Delay Status
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{task.delay_status}</div>
                    {task.delay_duration && (
                      <div className="text-muted-foreground">
                        Duration: {task.delay_duration}
                      </div>
                    )}
                    {task.delay_reason && (
                      <div className="text-muted-foreground">
                        Reason: {task.delay_reason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {task.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {task.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                entityType="task"
                entityId={task.task_id}
                limit={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 