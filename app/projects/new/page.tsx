/**
 * New Project Page
 * Allows creation of a new project
 */
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectForm } from '@/components/projects/project-form'

export const metadata: Metadata = {
  title: 'New Project',
  description: 'Create a new project in the system.',
}

export default async function NewProjectPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">
            Create a new project in the system.
          </p>
        </div>
        <ProjectForm customers={customers} />
      </div>
    </div>
  )
} 