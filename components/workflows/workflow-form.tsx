/**
 * WorkflowForm Component
 * Form for creating and editing workflows with tasks
 */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Workflow, WorkflowTask } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Trash2 } from 'lucide-react'

const workflowTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  scheduled_start_date: z.string().optional(),
  scheduled_end_date: z.string().optional(),
  scheduled_start_time: z.string().optional(),
  scheduled_end_time: z.string().optional(),
  priority: z.string().optional(),
})

const workflowFormSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  tasks: z.array(workflowTaskSchema),
})

type WorkflowFormValues = z.infer<typeof workflowFormSchema>

type WorkflowWithTasks = Workflow & {
  workflowTasks: WorkflowTask[]
}

interface WorkflowFormProps {
  workflow?: WorkflowWithTasks
  onSubmit: (data: WorkflowFormValues) => void
  onCancel: () => void
}

export function WorkflowForm({ workflow, onSubmit, onCancel }: WorkflowFormProps) {
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: workflow?.name || '',
      description: workflow?.description || '',
      tasks: workflow?.workflowTasks.map((task) => ({
        name: task.name,
        description: task.description || '',
        scheduled_start_date: task.scheduled_start_date?.toISOString().split('T')[0] || '',
        scheduled_end_date: task.scheduled_end_date?.toISOString().split('T')[0] || '',
        scheduled_start_time: task.scheduled_start_time?.toISOString().split('T')[1].slice(0, 5) || '',
        scheduled_end_time: task.scheduled_end_time?.toISOString().split('T')[1].slice(0, 5) || '',
        priority: task.priority || '',
      })) || [],
    },
  })

  const addTask = () => {
    const tasks = form.getValues('tasks')
    form.setValue('tasks', [
      ...tasks,
      {
        name: '',
        description: '',
        scheduled_start_date: '',
        scheduled_end_date: '',
        scheduled_start_time: '',
        scheduled_end_time: '',
        priority: '',
      },
    ])
  }

  const removeTask = (index: number) => {
    const tasks = form.getValues('tasks')
    form.setValue(
      'tasks',
      tasks.filter((_, i) => i !== index)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workflow Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter workflow name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter workflow description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tasks</h3>
            <Button type="button" onClick={addTask}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {form.watch('tasks').map((task, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">Task {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`tasks.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`tasks.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter task description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`tasks.${index}.scheduled_start_date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.scheduled_start_time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`tasks.${index}.scheduled_end_date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.scheduled_end_time`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name={`tasks.${index}.priority`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter task priority"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {workflow ? 'Update Workflow' : 'Create Workflow'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 