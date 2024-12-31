'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WorkflowForm } from './workflow-form'
import { FileText } from 'lucide-react'

interface CreateTravelerButtonProps {
  projectId?: number
}

export function CreateTravelerButton({ projectId = 0 }: CreateTravelerButtonProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4 mr-2" />
        {projectId === 0 ? 'New Project via Traveler' : 'Create Traveler'}
      </Button>
      <Dialog 
        open={open} 
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              {projectId === 0 ? 'Create New Project' : 'Project Traveler'}
            </DialogTitle>
          </DialogHeader>
          <WorkflowForm
            projectId={projectId}
            onSuccess={handleSuccess}
            isNewProject={projectId === 0}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 