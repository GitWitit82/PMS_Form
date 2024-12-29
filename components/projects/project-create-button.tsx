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
import { PlusIcon } from 'lucide-react'
import { logActivity } from '@/lib/activity-logger'

interface ProjectCreateButtonProps {
  customers: Array<{ customer_id: number; name: string }>
}

/**
 * A client component that handles project creation
 */
export function ProjectCreateButton({ customers }: ProjectCreateButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const result = await response.json()

      // Log the activity
      await logActivity({
        type: 'project',
        entityType: 'project',
        entityId: result.data.project_id,
        action: 'create',
        details: {
          name: data.name,
          customer: customers.find(c => c.customer_id === data.customer_id)?.name,
        },
      })

      router.refresh()
      setOpen(false)
      router.push(`/projects/${result.data.project_id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4 mr-2" />
        New Project
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            customers={customers}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 