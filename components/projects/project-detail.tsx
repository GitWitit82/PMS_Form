/**
 * Project Detail Component
 * Displays comprehensive information about a project
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ActivityFeed } from '@/components/activity-feed'
import { CalendarIcon, Users2Icon, ListTodoIcon, Pencil, Trash2 } from 'lucide-react'

interface Task {
  task_id: number
  name: string
  description: string
  status: string
  due_date?: string
  Resource?: {
    name: string
  } | null
}

interface Form {
  form_id: number
  name: string
  description: string
  status: string
  template: {
    name: string
  }
}

interface Project {
  project_id: number
  name: string
  description: string
  status: string
  customer_id: number
  vin_number?: string
  invoice_number?: string
  created_at: string
  updated_at: string
  start_date?: Date | null
  end_date?: Date | null
  Customer: {
    name: string
    email: string
    phone: string
  }
  tasks: Task[]
  forms: Form[]
}

interface ProjectDetailProps {
  project: Project
  onEdit?: () => void
}

export function ProjectDetail({ project, onEdit }: ProjectDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${project.project_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      })

      router.push('/projects')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete project',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const completedTasks = project.tasks.filter(
    (task) => task.status.toUpperCase() === 'COMPLETED'
  ).length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Created on {format(new Date(project.created_at), 'PPP')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit ? (
            <Button onClick={onEdit} variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/projects/${project.project_id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Start Date:</span>
                <span>
                  {project.start_date
                    ? format(new Date(project.start_date), 'PPP')
                    : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">End Date:</span>
                <span>
                  {project.end_date
                    ? format(new Date(project.end_date), 'PPP')
                    : 'Not set'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
            <Users2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="font-medium">{project.Customer.name}</div>
              {project.Customer.email && (
                <div className="text-muted-foreground mt-1">
                  {project.Customer.email}
                </div>
              )}
              {project.Customer.phone && (
                <div className="text-muted-foreground mt-1">
                  {project.Customer.phone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Progress:</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-muted-foreground">Tasks:</span>
                <span>
                  {completedTasks} / {totalTasks} completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>VIN Number: {project.vin_number || 'N/A'}</p>
              <p>Invoice Number: {project.invoice_number || 'N/A'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Project Tasks</CardTitle>
              <Button
                variant="outline"
                onClick={() => router.push(`/projects/${project.project_id}/tasks/new`)}
              >
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No tasks found for this project.
                </p>
              ) : (
                <div className="divide-y">
                  {project.tasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{task.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                        {task.Resource && (
                          <div className="text-sm text-gray-500">
                            Assigned to: {task.Resource.name}
                          </div>
                        )}
                        {task.due_date && (
                          <div className="text-sm text-gray-500">
                            Due: {format(new Date(task.due_date), 'PPP')}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Project Forms</CardTitle>
              <Button
                variant="outline"
                onClick={() => router.push(`/projects/${project.project_id}/forms/new`)}
              >
                Add Form
              </Button>
            </CardHeader>
            <CardContent>
              {project.forms.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No forms found for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {project.forms.map((form) => (
                    <Card key={form.form_id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{form.name}</CardTitle>
                          <Badge className={getStatusColor(form.status)}>
                            {form.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {form.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Template: {form.template.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                entityType="project"
                entityId={project.project_id}
                limit={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 