/**
 * Workflows Page
 * Displays and manages workflows
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Workflow, WorkflowTask } from '@prisma/client'
import { WorkflowList } from '@/components/workflows/workflow-list'
import { WorkflowForm } from '@/components/workflows/workflow-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'

type WorkflowWithTasks = Workflow & {
  workflowTasks: WorkflowTask[]
}

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<WorkflowWithTasks[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowWithTasks | undefined>()

  // Fetch workflows when component mounts
  useEffect(() => {
    fetchWorkflows()
  }, [])

  // Fetch workflows
  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      if (!response.ok) throw new Error('Failed to fetch workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch workflows',
        variant: 'destructive',
      })
    }
  }

  // Create workflow
  const createWorkflow = async (data: any) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create workflow')

      toast({
        title: 'Success',
        description: 'Workflow created successfully',
      })

      setIsFormOpen(false)
      router.refresh()
      fetchWorkflows()
    } catch (error) {
      console.error('Error creating workflow:', error)
      toast({
        title: 'Error',
        description: 'Failed to create workflow',
        variant: 'destructive',
      })
    }
  }

  // Update workflow
  const updateWorkflow = async (data: any) => {
    if (!selectedWorkflow) return

    try {
      const response = await fetch(`/api/workflows/${selectedWorkflow.workflow_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update workflow')

      toast({
        title: 'Success',
        description: 'Workflow updated successfully',
      })

      setIsFormOpen(false)
      setSelectedWorkflow(undefined)
      router.refresh()
      fetchWorkflows()
    } catch (error) {
      console.error('Error updating workflow:', error)
      toast({
        title: 'Error',
        description: 'Failed to update workflow',
        variant: 'destructive',
      })
    }
  }

  // Delete workflow
  const deleteWorkflow = async (workflowId: number) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete workflow')

      toast({
        title: 'Success',
        description: 'Workflow deleted successfully',
      })

      router.refresh()
      fetchWorkflows()
    } catch (error) {
      console.error('Error deleting workflow:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete workflow',
        variant: 'destructive',
      })
    }
  }

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(undefined)
    setIsFormOpen(true)
  }

  const handleEditWorkflow = (workflow: WorkflowWithTasks) => {
    setSelectedWorkflow(workflow)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    if (selectedWorkflow) {
      await updateWorkflow(data)
    } else {
      await createWorkflow(data)
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setSelectedWorkflow(undefined)
  }

  return (
    <div className="container mx-auto py-6">
      <WorkflowList
        workflows={workflows}
        onCreateWorkflow={handleCreateWorkflow}
        onEditWorkflow={handleEditWorkflow}
        onDeleteWorkflow={deleteWorkflow}
      />

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-[800px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <WorkflowForm
              workflow={selectedWorkflow}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
} 