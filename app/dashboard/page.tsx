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
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ActivityFeed } from '@/components/activity-feed'

export const metadata: Metadata = {
  title: 'Dashboard | Enterprise Project Management',
  description: 'Overview of your projects and tasks',
}

async function getMetrics() {
  const [totalProjects, totalTasks, totalResources] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
    prisma.resource.count(),
  ])

  return {
    totalProjects,
    totalTasks,
    totalResources,
  }
}

async function getRecentProjects(limit = 5) {
  return prisma.project.findMany({
    take: limit,
    orderBy: {
      created_at: 'desc',
    },
    include: {
      Customer: true,
      Task: {
        select: {
          task_id: true,
        },
      },
    },
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }

  const metrics = await getMetrics()
  const recentProjects = await getRecentProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Projects</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {metrics.totalProjects}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {metrics.totalTasks}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Resources</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {metrics.totalResources}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProjects.map((project) => (
                    <tr key={project.project_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.Customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.Task.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Recent Activities
            </h2>
            <ActivityFeed limit={10} />
          </div>
        </div>
      </div>
    </div>
  )
} 