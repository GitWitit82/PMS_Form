/**
 * Project Traveler Page
 * Displays a printable traveler document for a project
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectTraveler } from '@/components/projects/project-traveler'

interface ProjectTravelerPageProps {
  params: {
    projectId: string
  }
}

export async function generateMetadata({
  params,
}: ProjectTravelerPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { project_id: parseInt(params.projectId) },
    select: { name: true },
  })

  return {
    title: project ? `${project.name} - Traveler` : 'Project Not Found',
    description: project
      ? `View traveler document for project: ${project.name}`
      : 'The requested project could not be found.',
  }
}

export default async function ProjectTravelerPage({
  params,
}: ProjectTravelerPageProps) {
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

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <ProjectTraveler project={project} />
    </div>
  )
} 