/**
 * TaskDependencies Component
 * Manages and displays task dependencies within a workflow
 */
'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Task {
  workflow_task_id: number
  name: string
  status: string
}

interface Dependency {
  dependency_id: number
  task_id: number
  dependent_task_id: number
  dependency_type: string
  lag_time?: number
  task: Task
  dependent_task: Task
}

interface TaskDependenciesProps {
  workflowId: number
  taskId: number
  availableTasks: Task[]
  dependencies: Dependency[]
  onDependencyChange: (dependencies: Dependency[]) => void
}

const DEPENDENCY_TYPES = [
  { value: 'start-to-start', label: 'Start to Start' },
  { value: 'start-to-finish', label: 'Start to Finish' },
  { value: 'finish-to-start', label: 'Finish to Start' },
  { value: 'finish-to-finish', label: 'Finish to Finish' },
]

export function TaskDependencies({
  workflowId,
  taskId,
  availableTasks,
  dependencies,
  onDependencyChange,
}: TaskDependenciesProps) {
  const [loading, setLoading] = useState(false)

  const addDependency = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/task-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          dependent_task_id: availableTasks[0]?.workflow_task_id,
          dependency_type: 'finish-to-start',
          lag_time: 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to add dependency')

      const newDependency = await response.json()
      onDependencyChange([...dependencies, newDependency])
      toast.success('Dependency added successfully')
    } catch (error) {
      console.error('Error adding dependency:', error)
      toast.error('Failed to add dependency')
    } finally {
      setLoading(false)
    }
  }

  const updateDependency = async (
    dependencyId: number,
    data: Partial<Dependency>
  ) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/task-dependencies/${dependencyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update dependency')

      const updatedDependency = await response.json()
      const updatedDependencies = dependencies.map((dep) =>
        dep.dependency_id === dependencyId ? updatedDependency : dep
      )
      onDependencyChange(updatedDependencies)
      toast.success('Dependency updated successfully')
    } catch (error) {
      console.error('Error updating dependency:', error)
      toast.error('Failed to update dependency')
    } finally {
      setLoading(false)
    }
  }

  const removeDependency = async (dependencyId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/task-dependencies/${dependencyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove dependency')

      const updatedDependencies = dependencies.filter(
        (dep) => dep.dependency_id !== dependencyId
      )
      onDependencyChange(updatedDependencies)
      toast.success('Dependency removed successfully')
    } catch (error) {
      console.error('Error removing dependency:', error)
      toast.error('Failed to remove dependency')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dependencies</CardTitle>
            <CardDescription>
              Manage task dependencies and relationships
            </CardDescription>
          </div>
          <Button
            onClick={addDependency}
            disabled={loading || availableTasks.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dependency
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dependencies.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No dependencies configured
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dependent Task</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lag Time (mins)</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dependencies.map((dependency) => (
                <TableRow key={dependency.dependency_id}>
                  <TableCell>
                    <Select
                      value={dependency.dependent_task_id.toString()}
                      onValueChange={(value) =>
                        updateDependency(dependency.dependency_id, {
                          dependent_task_id: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {
                            availableTasks.find(
                              (t) =>
                                t.workflow_task_id ===
                                dependency.dependent_task_id
                            )?.name
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTasks
                          .filter((t) => t.workflow_task_id !== taskId)
                          .map((task) => (
                            <SelectItem
                              key={task.workflow_task_id}
                              value={task.workflow_task_id.toString()}
                            >
                              {task.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={dependency.dependency_type}
                      onValueChange={(value) =>
                        updateDependency(dependency.dependency_id, {
                          dependency_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {
                            DEPENDENCY_TYPES.find(
                              (t) => t.value === dependency.dependency_type
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DEPENDENCY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={dependency.lag_time || 0}
                      onChange={(e) =>
                        updateDependency(dependency.dependency_id, {
                          lag_time: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDependency(dependency.dependency_id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 