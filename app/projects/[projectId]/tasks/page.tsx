/**
 * Project Tasks List Page
 * Displays all tasks for a specific project
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { TaskList } from '@/components/tasks/task-list'

interface ProjectTasksPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectTasksPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `${project.name} - Tasks` : 'Project Not Found',
    description: project
      ? `View and manage tasks for project: ${project.name}`
      : 'The requested project could not be found.',
  }
}

export default async function ProjectTasksPage({
  params,
}: ProjectTasksPageProps) {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    include: {
      tasks: {
        include: {
          assignee: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
          <p className="text-muted-foreground">
            Manage tasks for {project.name}
          </p>
        </div>
        <TaskList
          projectId={project.project_id}
          initialTasks={project.tasks}
        />
      </div>
    </div>
  )
} 