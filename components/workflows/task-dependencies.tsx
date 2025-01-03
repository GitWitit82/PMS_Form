/**
 * TaskDependencies Component
 * Manages and displays task dependencies within a workflow
 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { WorkflowTask } from '@/types/workflow'

interface TaskDependenciesProps {
  task: WorkflowTask
  allTasks: WorkflowTask[]
  onUpdate: (updatedTask: WorkflowTask) => void
}

export function TaskDependencies({ task, allTasks, onUpdate }: TaskDependenciesProps) {
  const [selectedDependencies, setSelectedDependencies] = useState<number[]>(
    task.dependencies?.map(d => d.task_id) || []
  )

  const handleDependencyChange = (taskId: number) => {
    const updated = selectedDependencies.includes(taskId)
      ? selectedDependencies.filter(id => id !== taskId)
      : [...selectedDependencies, taskId]
    
    setSelectedDependencies(updated)
    onUpdate({
      ...task,
      dependencies: allTasks.filter(t => updated.includes(t.task_id))
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Task Dependencies</h3>
      <div className="space-y-2">
        {allTasks
          .filter(t => t.task_id !== task.task_id)
          .map(t => (
            <div key={t.task_id} className="flex items-center space-x-2">
              <Checkbox
                id={`task-${t.task_id}`}
                checked={selectedDependencies.includes(t.task_id)}
                onCheckedChange={() => handleDependencyChange(t.task_id)}
              />
              <Label htmlFor={`task-${t.task_id}`}>{t.name}</Label>
            </div>
          ))}
      </div>
    </div>
  )
} 