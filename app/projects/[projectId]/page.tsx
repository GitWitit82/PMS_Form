/**
 * Project Detail Page
 * Displays detailed information about a specific project
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectDetail } from '@/components/projects/project-detail'

interface ProjectDetailPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `${project.name} - Project Details` : 'Project Not Found',
    description: project
      ? `View and manage details for project: ${project.name}`
      : 'The requested project could not be found.',
  }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    include: {
      Customer: true,
      tasks: {
        orderBy: {
          created_at: 'desc',
        },
      },
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
  })

  const workflow = project?.workflow_id ? await prisma.workflow.findUnique({
    where: { workflow_id: project.workflow_id },
    include: {
      workflowTasks: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  }) : null;

  const projectWithWorkflow = {
    ...project,
    workflow,
  };

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <ProjectDetail project={projectWithWorkflow} />
    </div>
  )
} 