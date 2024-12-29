/**
 * Projects Page: Project management interface
 * Lists all projects with filtering and sorting capabilities
 */
import React from 'react'
import { Metadata } from 'next'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { ClientLayout } from '@/components/client-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const metadata: Metadata = {
  title: 'Projects | Enterprise Project Management',
  description: 'Manage and track all your projects',
}

async function getProjects() {
  return prisma.project.findMany({
    include: {
      Customer: true,
      Task: {
        select: {
          task_id: true,
          status: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

function calculateProjectProgress(tasks: { status: string }[]) {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length
  return Math.round((completedTasks / tasks.length) * 100)
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>
                  A list of all projects and their current status
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.project_id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.Customer.name}</TableCell>
                    <TableCell>
                      {project.start_date
                        ? format(project.start_date, 'MMM d, yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell>
                      {project.end_date
                        ? format(project.end_date, 'MMM d, yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : project.status === 'On Hold'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {calculateProjectProgress(project.Task)}%
                    </TableCell>
                    <TableCell>{project.Task.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
} 