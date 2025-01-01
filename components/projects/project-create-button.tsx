/**
 * Project Create Button Component
 * Displays a button that opens a modal for creating new projects
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ProjectForm } from './project-form'
import { Plus } from 'lucide-react'
import { useCustomers } from '@/hooks/use-customers'
import { useSession } from 'next-auth/react'

export function ProjectCreateButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { customers, loading, isAuthenticated } = useCustomers()
  const { data: session, status } = useSession()

  const handleSuccess = () => {
    setOpen(false)
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleClick}>
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new project.
            </DialogDescription>
          </DialogHeader>
          {!isAuthenticated ? (
            <div className="text-center py-6 text-muted-foreground">
              Please sign in to create a project.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : customers && customers.length > 0 ? (
            <ProjectForm
              customers={customers}
              onSuccess={handleSuccess}
            />
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No customers found. Please add a customer first.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 