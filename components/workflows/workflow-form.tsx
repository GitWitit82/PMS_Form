/**
 * WorkflowForm Component
 * Form for creating and editing workflows with tasks
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import type { Workflow, WorkflowTask } from '@/types/workflow'

interface WorkflowFormProps {
  projectId: number
  workflow?: Workflow
  tasks?: WorkflowTask[]
}

export function WorkflowForm({ projectId, workflow, tasks = [] }: WorkflowFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: workflow?.name || '',
    description: workflow?.description || '',
    tasks: tasks || []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/workflows${workflow ? `/${workflow.workflow_id}` : ''}`, {
        method: workflow ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save workflow')
      }

      toast.success(`Workflow ${workflow ? 'updated' : 'created'} successfully`)
      router.refresh()
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error('Error saving workflow:', error)
      toast.error('Failed to save workflow')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskChange = (task: WorkflowTask, index: number) => {
    const updatedTasks = [...formData.tasks]
    updatedTasks[index] = task
    setFormData({ ...formData, tasks: updatedTasks })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : workflow ? 'Update Workflow' : 'Create Workflow'}
      </Button>
    </form>
  )
} 