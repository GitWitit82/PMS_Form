'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react'

interface TaskProgress {
  task_id: number
  name: string
  status: string
  scheduled_start_date?: Date | null
  scheduled_end_date?: Date | null
  actual_start_date?: Date | null
  actual_end_date?: Date | null
  completion_percentage: number
  delay_status?: string | null
  delay_duration?: string | null
  delay_reason?: string | null
  Dependencies: Array<{
    dependency_id: number
    dependency_type: string
    DependentTask: {
      task_id: number
      name: string
      status: string
    }
  }>
}

interface TaskProgressProps {
  task: TaskProgress
  onUpdateProgress: (percentage: number) => Promise<void>
}

/**
 * A component that displays task progress and timeline
 */
export function TaskProgress({
  task,
  onUpdateProgress,
}: TaskProgressProps) {
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-600'
    if (percentage >= 75) return 'bg-blue-600'
    if (percentage >= 50) return 'bg-yellow-600'
    if (percentage >= 25) return 'bg-orange-600'
    return 'bg-red-600'
  }

  const isDelayed =
    task.delay_status === 'Delayed' || task.delay_status === 'Severely Delayed'

  const canStart = task.Dependencies.every(
    (dep) =>
      dep.dependency_type === 'Start to Start' ||
      dep.DependentTask.status === 'Completed'
  )

  const handleProgressUpdate = async (increment: number) => {
    const newProgress = Math.min(
      Math.max(0, task.completion_percentage + increment),
      100
    )
    await onUpdateProgress(newProgress)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              Track task completion and timeline
            </CardDescription>
          </div>
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              Completion: {task.completion_percentage}%
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressUpdate(-10)}
                disabled={task.completion_percentage <= 0}
              >
                -10%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressUpdate(10)}
                disabled={task.completion_percentage >= 100}
              >
                +10%
              </Button>
            </div>
          </div>
          <Progress
            value={task.completion_percentage}
            className={getProgressColor(task.completion_percentage)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Timeline</div>
            {!canStart && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-yellow-600">
                      <AlertCircleIcon className="h-4 w-4 mr-1" />
                      Waiting for dependencies
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Some dependent tasks need to be completed first</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Scheduled</div>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Start:{' '}
                  {task.scheduled_start_date ? (
                    format(new Date(task.scheduled_start_date), 'PPP')
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  End:{' '}
                  {task.scheduled_end_date ? (
                    format(new Date(task.scheduled_end_date), 'PPP')
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Actual</div>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Start:{' '}
                  {task.actual_start_date ? (
                    format(new Date(task.actual_start_date), 'PPP')
                  ) : (
                    <span className="text-muted-foreground">Not started</span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  End:{' '}
                  {task.actual_end_date ? (
                    format(new Date(task.actual_end_date), 'PPP')
                  ) : (
                    <span className="text-muted-foreground">Not completed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isDelayed && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center text-red-600 font-medium mb-2">
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                {task.delay_status}
              </div>
              {task.delay_duration && (
                <div className="text-sm text-red-600 mb-1">
                  Duration: {task.delay_duration}
                </div>
              )}
              {task.delay_reason && (
                <div className="text-sm text-red-600">
                  Reason: {task.delay_reason}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 