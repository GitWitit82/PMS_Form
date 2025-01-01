/**
 * Project Forms List Page
 * Displays all forms for a specific project
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { FormList } from '@/components/forms/form-list'

interface ProjectFormsPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectFormsPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `${project.name} - Forms` : 'Project Not Found',
    description: project
      ? `View and manage forms for project: ${project.name}`
      : 'The requested project could not be found.',
  }
}

export default async function ProjectFormsPage({
  params,
}: ProjectFormsPageProps) {
  const [project, formTemplates] = await Promise.all([
    prisma.project.findUnique({
      where: { project_id: parseInt(params.projectId) },
      include: {
        forms: {
          include: {
            form: true,
            template: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    }),
    prisma.formTemplate.findMany({
      where: { is_active: true },
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
          <h1 className="text-3xl font-bold tracking-tight">Project Forms</h1>
          <p className="text-muted-foreground">
            Manage forms for {project.name}
          </p>
        </div>
        <FormList
          projectId={project.project_id}
          initialForms={project.forms}
          formTemplates={formTemplates}
        />
      </div>
    </div>
  )
} 