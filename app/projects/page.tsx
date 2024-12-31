'use client'

import { useRouter } from 'next/navigation'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectCreateButton } from '@/components/projects/project-create-button'
import { CreateTravelerButton } from '@/components/projects/create-traveler-button'
import { useProjects } from '@/hooks/use-projects'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, loading } = useProjects()

  const handleViewProject = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateTravelerButton projectId={0} />
          <ProjectCreateButton />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onViewProject={handleViewProject}
        />
      )}
    </div>
  )
} 