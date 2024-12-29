'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const taskDependencySchema = z.object({
  dependent_task_id: z.string().min(1, 'Dependent task is required'),
  dependency_type: z.enum(['Finish to Start', 'Start to Start', 'Finish to Finish', 'Start to Finish']),
})

type TaskDependencyFormValues = z.infer<typeof taskDependencySchema>

interface Task {
  task_id: number
  name: string
  status: string
  Project: {
    name: string
  }
}

interface TaskDependencyFormProps {
  tasks: Task[]
  currentTaskId: number
  existingDependencies: number[]
  onSubmit: (values: TaskDependencyFormValues) => Promise<void>
  onCancel: () => void
}

/**
 * A form component for managing task dependencies
 */
export function TaskDependencyForm({
  tasks,
  currentTaskId,
  existingDependencies,
  onSubmit,
  onCancel,
}: TaskDependencyFormProps) {
  const form = useForm<TaskDependencyFormValues>({
    resolver: zodResolver(taskDependencySchema),
    defaultValues: {
      dependency_type: 'Finish to Start',
    },
  })

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

  const availableTasks = tasks.filter(
    (task) =>
      task.task_id !== currentTaskId &&
      !existingDependencies.includes(task.task_id)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dependent_task_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependent Task</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTasks.map((task) => (
                    <SelectItem
                      key={task.task_id}
                      value={task.task_id.toString()}
                    >
                      <div className="flex flex-col">
                        <div>{task.name}</div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{task.Project.name}</span>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dependency_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependency Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependency type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Finish to Start">
                    Finish to Start (FS)
                  </SelectItem>
                  <SelectItem value="Start to Start">
                    Start to Start (SS)
                  </SelectItem>
                  <SelectItem value="Finish to Finish">
                    Finish to Finish (FF)
                  </SelectItem>
                  <SelectItem value="Start to Finish">
                    Start to Finish (SF)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            Add Dependency
          </Button>
        </div>
      </form>
    </Form>
  )
} 