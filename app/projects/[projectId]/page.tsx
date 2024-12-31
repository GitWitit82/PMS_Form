'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreateTravelerButton } from '@/components/projects/create-traveler-button'
import { toast } from 'sonner'

interface Project {
  project_id: number
  name: string
  description?: string
  status: string
  Customer: {
    name: string
  }
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.projectId as string)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch project')
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        toast.error('Failed to load project details')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/3" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="text-primary hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{project.Customer.name}</span>
            <span>•</span>
            <span className="capitalize">{project.status.toLowerCase()}</span>
          </div>
          {project.description && (
            <p className="mt-4 text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <CreateTravelerButton projectId={projectId} />
        </div>
      </div>
    </div>
  )
} 