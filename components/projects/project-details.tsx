import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityFeed } from '@/components/activity-feed'
import { CalendarIcon, Users2Icon, ListTodoIcon } from 'lucide-react'

interface ProjectDetailsProps {
  project: {
    project_id: number
    name: string
    description?: string | null
    start_date?: Date | null
    end_date?: Date | null
    status: string
    created_at: Date
    Customer: {
      name: string
      email?: string | null
      phone?: string | null
    }
    Task: Array<{
      task_id: number
      name: string
      status: string
      Resource?: {
        name: string
      } | null
    }>
  }
  onEdit?: () => void
}

/**
 * A component that displays detailed project information
 */
export function ProjectDetails({ project, onEdit }: ProjectDetailsProps) {
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

  const completedTasks = project.Task.filter(
    (task) => task.status === 'Completed'
  ).length
  const totalTasks = project.Task.length
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
        {onEdit && (
          <Button onClick={onEdit} variant="outline">
            Edit Project
          </Button>
        )}
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
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Project Tasks</CardTitle>
                <Button variant="outline">Add Task</Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.Task.length > 0 ? (
                <div className="divide-y">
                  {project.Task.map((task) => (
                    <div
                      key={task.task_id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{task.name}</div>
                        {task.Resource && (
                          <div className="text-sm text-gray-500">
                            Assigned to: {task.Resource.name}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No tasks created yet
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