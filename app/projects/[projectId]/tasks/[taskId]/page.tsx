'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TaskDetails } from '@/components/tasks/task-details'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskDependencies } from '@/components/tasks/task-dependencies'
import { TaskProgress } from '@/components/tasks/task-progress'
import { TaskHistory } from '@/components/tasks/task-history'
import { TaskReports } from '@/components/tasks/task-reports'
import { logActivity } from '@/lib/activity-logger'

interface Project {
  project_id: number
  name: string
}

interface Resource {
  resource_id: number
  name: string
  Department?: {
    name: string
  } | null
}

interface Department {
  department_id: number
  name: string
}

interface Task {
  task_id: number
  name: string
  description?: string | null
  project_id: number
  resource_id?: number | null
  department_id?: number | null
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
  completion_percentage: number
  priority: string
  status: string
  created_at: Date
  Project: Project
  Resource?: Resource | null
  Department?: Department | null
  Dependencies: Array<{
    dependency_id: number
    dependent_task_id: number
    dependency_type: string
    DependentTask: {
      task_id: number
      name: string
      status: string
      Project: {
        name: string
      }
    }
  }>
}

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

interface TaskPageProps {
  params: {
    projectId: string
    taskId: string
  }
}

/**
 * A page component that displays task details and management options
 */
export default function TaskPage({ params }: TaskPageProps) {
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [history, setHistory] = useState<TaskHistory[]>([])
  const [metrics, setMetrics] = useState({
    total_tasks: 0,
    completed_tasks: 0,
    in_progress_tasks: 0,
    delayed_tasks: 0,
    on_hold_tasks: 0,
    cancelled_tasks: 0,
    average_completion_time: 0,
    average_delay_duration: 0,
  })
  const [trends, setTrends] = useState([])
  const [priorities, setPriorities] = useState([])

  // Fetch task data
  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${params.taskId}`)
      const data = await response.json()
      if (response.ok) {
        setTask(data.task)
      }
    } catch (error) {
      console.error('Error fetching task:', error)
    }
  }

  // Fetch task history
  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `/api/tasks/${params.taskId}/history`
      )
      const data = await response.json()
      if (response.ok) {
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  // Fetch task metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch(
        `/api/projects/${params.projectId}/tasks/metrics`
      )
      const data = await response.json()
      if (response.ok) {
        setMetrics(data.metrics)
        setTrends(data.trends)
        setPriorities(data.priorities)
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  // Handle task update
  const handleTaskUpdate = async (values: any) => {
    try {
      const response = await fetch(`/api/tasks/${params.taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        await logActivity({
          entity_type: 'task',
          entity_id: parseInt(params.taskId),
          action: 'update',
          details: 'Task updated',
        })
        setIsEditDialogOpen(false)
        await fetchTask()
        await fetchHistory()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Handle status update
  const handleStatusUpdate = async (status: string) => {
    try {
      const response = await fetch(
        `/api/tasks/${params.taskId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      if (response.ok) {
        await logActivity({
          entity_type: 'task',
          entity_id: parseInt(params.taskId),
          action: 'status_update',
          details: `Status updated to ${status}`,
        })
        await fetchTask()
        await fetchHistory()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Handle progress update
  const handleProgressUpdate = async (percentage: number) => {
    try {
      const response = await fetch(
        `/api/tasks/${params.taskId}/progress`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ percentage }),
        }
      )

      if (response.ok) {
        await logActivity({
          entity_type: 'task',
          entity_id: parseInt(params.taskId),
          action: 'progress_update',
          details: `Progress updated to ${percentage}%`,
        })
        await fetchTask()
        await fetchHistory()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  // Handle dependency management
  const handleAddDependency = async (values: {
    dependent_task_id: string
    dependency_type: string
  }) => {
    try {
      const response = await fetch(
        `/api/tasks/${params.taskId}/dependencies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      )

      if (response.ok) {
        await logActivity({
          entity_type: 'task',
          entity_id: parseInt(params.taskId),
          action: 'dependency_added',
          details: 'Task dependency added',
        })
        await fetchTask()
        await fetchHistory()
      }
    } catch (error) {
      console.error('Error adding dependency:', error)
    }
  }

  const handleRemoveDependency = async (dependencyId: number) => {
    try {
      const response = await fetch(
        `/api/tasks/${params.taskId}/dependencies/${dependencyId}`,
        {
          method: 'DELETE',
        }
      )

      if (response.ok) {
        await logActivity({
          entity_type: 'task',
          entity_id: parseInt(params.taskId),
          action: 'dependency_removed',
          details: 'Task dependency removed',
        })
        await fetchTask()
        await fetchHistory()
      }
    } catch (error) {
      console.error('Error removing dependency:', error)
    }
  }

  if (!task) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <TaskDetails
        task={task}
        onEdit={() => setIsEditDialogOpen(true)}
        onUpdateStatus={handleStatusUpdate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskProgress
          task={task}
          onUpdateProgress={handleProgressUpdate}
        />

        <TaskDependencies
          task={task}
          dependencies={task.Dependencies}
          availableTasks={[]} // Fetch available tasks
          onAddDependency={handleAddDependency}
          onRemoveDependency={handleRemoveDependency}
        />
      </div>

      <TaskHistory history={history} />

      <TaskReports
        metrics={metrics}
        trends={trends}
        priorities={priorities}
      />

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and settings
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            projects={projects}
            resources={resources}
            departments={departments}
            defaultValues={{
              name: task.name,
              description: task.description || '',
              project_id: task.project_id.toString(),
              resource_id: task.resource_id?.toString(),
              department_id: task.department_id?.toString(),
              scheduled_start_date: task.scheduled_start_date,
              scheduled_end_date: task.scheduled_end_date,
              scheduled_start_time: task.scheduled_start_time,
              scheduled_end_time: task.scheduled_end_time,
              priority: task.priority,
              status: task.status,
            }}
            onSubmit={handleTaskUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 