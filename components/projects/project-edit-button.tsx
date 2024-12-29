'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from './project-form'
import { logActivity } from '@/lib/activity-logger'

interface ProjectEditButtonProps {
  project: {
    project_id: number
    name: string
    description?: string | null
    customer_id: number
    start_date?: Date | null
    end_date?: Date | null
    status: string
  }
  customers: Array<{ customer_id: number; name: string }>
}

/**
 * A client component that handles project editing
 */
export function ProjectEditButton({ project, customers }: ProjectEditButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/projects/${project.project_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      // Log the activity
      await logActivity({
        type: 'project',
        entityType: 'project',
        entityId: project.project_id,
        action: 'update',
        details: {
          name: data.name,
          customer: customers.find(c => c.customer_id === data.customer_id)?.name,
          status: data.status,
        },
      })

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit Project
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={project}
            customers={customers}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 