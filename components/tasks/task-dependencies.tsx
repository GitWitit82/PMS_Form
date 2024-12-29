'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TaskDependencyForm } from './task-dependency-form'
import { PlusIcon, XIcon } from 'lucide-react'

interface Task {
  task_id: number
  name: string
  status: string
  Project: {
    name: string
  }
}

interface TaskDependency {
  dependency_id: number
  dependent_task_id: number
  dependency_type: string
  DependentTask: Task
}

interface TaskDependenciesProps {
  task: Task
  dependencies: TaskDependency[]
  availableTasks: Task[]
  onAddDependency: (values: {
    dependent_task_id: string
    dependency_type: string
  }) => Promise<void>
  onRemoveDependency: (dependencyId: number) => Promise<void>
}

/**
 * A component that displays task dependencies and allows adding/removing them
 */
export function TaskDependencies({
  task,
  dependencies,
  availableTasks,
  onAddDependency,
  onRemoveDependency,
}: TaskDependenciesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleAddDependency = async (values: {
    dependent_task_id: string
    dependency_type: string
  }) => {
    await onAddDependency(values)
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dependencies</CardTitle>
            <CardDescription>
              Tasks that must be completed before this task can start
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Dependency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task Dependency</DialogTitle>
                <DialogDescription>
                  Select a task that must be completed before {task.name} can start
                </DialogDescription>
              </DialogHeader>
              <TaskDependencyForm
                tasks={availableTasks}
                currentTaskId={task.task_id}
                existingDependencies={dependencies.map(
                  (dep) => dep.dependent_task_id
                )}
                onSubmit={handleAddDependency}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {dependencies.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No dependencies added
          </div>
        ) : (
          <div className="space-y-4">
            {dependencies.map((dependency) => (
              <div
                key={dependency.dependency_id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {dependency.DependentTask.name}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{dependency.DependentTask.Project.name}</span>
                    <Badge
                      className={getStatusColor(
                        dependency.DependentTask.status
                      )}
                    >
                      {dependency.DependentTask.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dependency.dependency_type}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveDependency(dependency.dependency_id)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 