/**
 * Project Edit Page
 * Allows editing of an existing project's details
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectForm } from '@/components/projects/project-form'

interface ProjectEditPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectEditPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `Edit ${project.name}` : 'Project Not Found',
    description: project
      ? `Edit details for project: ${project.name}`
      : 'The requested project could not be found.',
  }
}

export default async function ProjectEditPage({
  params,
}: ProjectEditPageProps) {
  const [project, customers] = await Promise.all([
    prisma.project.findUnique({
      where: { project_id: parseInt(params.projectId) },
    }),
    prisma.customer.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Make changes to project information.
          </p>
        </div>
        <ProjectForm
          customers={customers}
          initialData={{
            ...project,
            customer_id: project.customer_id.toString(),
          }}
        />
      </div>
    </div>
  )
} 