/**
 * Dashboard Page: Main entry point of the application
 * Displays key metrics, recent activities, and project overview
 */
import React from 'react'
import { Metadata } from 'next'
import { ClientLayout } from '@/components/client-layout'
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
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Dashboard | Enterprise Project Management',
  description: 'Overview of your projects and tasks',
}

async function getMetrics() {
  const [
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
    totalResources,
    totalWorkflows,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({
      where: { status: 'In Progress' },
    }),
    prisma.task.count(),
    prisma.task.count({
      where: { status: 'Pending' },
    }),
    prisma.resource.count(),
    prisma.workflow.count(),
  ])

  return {
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
    totalResources,
    totalWorkflows,
  }
}

async function getRecentProjects() {
  return prisma.project.findMany({
    take: 5,
    orderBy: { created_at: 'desc' },
    include: {
      Customer: true,
      Task: {
        take: 1,
        orderBy: { created_at: 'desc' },
      },
    },
  })
}

export default async function DashboardPage() {
  const metrics = await getMetrics()
  const recentProjects = await getRecentProjects()

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your projects and tasks
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeProjects} active projects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.pendingTasks} pending tasks
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalResources}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalWorkflows} active workflows
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your most recently created projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.project_id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.Customer.name}</TableCell>
                      <TableCell>{project.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Status Distribution</CardTitle>
              <CardDescription>
                Overview of project statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add a chart here using Recharts */}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  )
} 