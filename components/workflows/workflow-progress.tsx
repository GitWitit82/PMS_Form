/**
 * WorkflowProgress Component
 * Displays and manages workflow progress, including task dependencies and completion status
 */
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Task {
  workflow_task_id: number
  name: string
  status: string
  start_date?: string
  end_date?: string
  dependencies: {
    dependency_id: number
    dependent_task: {
      workflow_task_id: number
      name: string
      status: string
    }
    dependency_type: string
    lag_time: number
  }[]
}

interface WorkflowProgressProps {
  workflowId: number
  tasks: Task[]
  onTaskUpdate: (taskId: number, status: string) => void
}

const STATUS_COLORS = {
  'not-started': 'bg-gray-200',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
  blocked: 'bg-red-500',
}

const STATUS_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
  blocked: 'Blocked',
}

export function WorkflowProgress({
  workflowId,
  tasks,
  onTaskUpdate,
}: WorkflowProgressProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    calculateProgress()
  }, [tasks])

  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.status === 'completed')
    const progressPercentage = (completedTasks.length / tasks.length) * 100
    setProgress(progressPercentage)
  }

  const canStartTask = (task: Task) => {
    if (task.dependencies.length === 0) return true

    return task.dependencies.every((dep) => {
      const dependentTask = tasks.find(
        (t) => t.workflow_task_id === dep.dependent_task.workflow_task_id
      )
      if (!dependentTask) return false

      switch (dep.dependency_type) {
        case 'finish-to-start':
          return dependentTask.status === 'completed'
        case 'start-to-start':
          return dependentTask.status === 'in-progress' || dependentTask.status === 'completed'
        case 'finish-to-finish':
          return true // Can start, but can't complete until dependency is completed
        case 'start-to-finish':
          return dependentTask.status === 'in-progress' || dependentTask.status === 'completed'
        default:
          return false
      }
    })
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update task status')

      onTaskUpdate(taskId, newStatus)
      toast.success('Task status updated successfully')
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Failed to update task status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Workflow Progress</CardTitle>
            <CardDescription>Track task completion and dependencies</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Overall Progress: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-[200px]" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dependencies</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.workflow_task_id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <Badge
                    className={`cursor-pointer ${
                      STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]
                    }`}
                    onClick={() => {
                      if (!canStartTask(task)) {
                        toast.error('Cannot start task: Dependencies not met')
                        return
                      }
                      const nextStatus =
                        task.status === 'not-started'
                          ? 'in-progress'
                          : task.status === 'in-progress'
                          ? 'completed'
                          : 'not-started'
                      handleStatusChange(task.workflow_task_id, nextStatus)
                    }}
                  >
                    {STATUS_LABELS[task.status as keyof typeof STATUS_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.dependencies.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {task.dependencies.map((dep) => (
                        <div
                          key={dep.dependency_id}
                          className="text-sm text-muted-foreground"
                        >
                          {dep.dependent_task.name} ({dep.dependency_type})
                          {dep.lag_time > 0 && ` +${dep.lag_time}m`}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.start_date
                    ? new Date(task.start_date).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {task.end_date
                    ? new Date(task.end_date).toLocaleDateString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 