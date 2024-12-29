import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProjectDetails } from '@/components/projects/project-details'
import { ProjectEditButton } from '@/components/projects/project-edit-button'

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `${project.name} | Projects` : 'Project Not Found',
    description: 'View and manage project details',
  }
}

async function getProject(projectId: number) {
  return prisma.project.findUnique({
    where: { project_id: projectId },
    include: {
      Customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      Task: {
        select: {
          task_id: true,
          name: true,
          status: true,
          Resource: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
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
 * Project details page component
 * Displays detailed information about a specific project
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }

  const projectId = parseInt(params.projectId)
  if (isNaN(projectId)) {
    notFound()
  }

  const [project, customers] = await Promise.all([
    getProject(projectId),
    getCustomers(),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectDetails
        project={project}
        onEdit={
          <ProjectEditButton
            project={{
              project_id: project.project_id,
              name: project.name,
              description: project.description,
              customer_id: project.Customer.customer_id,
              start_date: project.start_date,
              end_date: project.end_date,
              status: project.status,
            }}
            customers={customers}
          />
        }
      />
    </div>
  )
} 