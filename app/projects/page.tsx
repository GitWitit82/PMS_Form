/**
 * Projects Page: Project management interface
 * Lists all projects with filtering and sorting capabilities
 */
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectCreateButton } from '@/components/projects/project-create-button'

export const metadata: Metadata = {
  title: 'Projects | Enterprise Project Management',
  description: 'Manage and track all your projects',
}

async function getProjects() {
  return prisma.project.findMany({
    include: {
      Customer: {
        select: {
          name: true,
        },
      },
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

async function getCustomers() {
  return prisma.customer.findMany({
    select: {
      customer_id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

/**
 * Projects page component
 * Lists all projects and provides options to create, view, and manage projects
 */
export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }

  const [projects, customers] = await Promise.all([
    getProjects(),
    getCustomers(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects
          </p>
        </div>
        <ProjectCreateButton customers={customers} />
      </div>

      <ProjectList
        projects={projects}
        onViewProject={(projectId) => {
          // This will be handled by client-side navigation
        }}
      />
    </div>
  )
} 