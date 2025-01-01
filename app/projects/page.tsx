/**
 * Projects List Page
 * Displays a list of all projects with filtering and sorting capabilities
 */
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectList } from '@/components/projects/project-list'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'View and manage all projects in the system.',
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      Customer: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          View and manage all projects in the system.
        </p>
      </div>
      <ProjectList initialProjects={projects} />
    </div>
  )
} 