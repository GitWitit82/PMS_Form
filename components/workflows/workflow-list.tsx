/**
 * WorkflowList Component
 * Displays a list of workflows with their associated tasks
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

interface Workflow {
  workflow_id: number
  name: string
  description: string
  created_at: string
  workflowTasks: Array<{
    workflow_task_id: number
    name: string
    status: string
  }>
}

export function WorkflowList() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('/api/workflows')
        if (!response.ok) {
          throw new Error('Failed to fetch workflows')
        }
        const data = await response.json()
        setWorkflows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        toast.error('Failed to load workflows')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete workflow')
      }

      setWorkflows(workflows.filter(w => w.workflow_id !== id))
      toast.success('Workflow deleted successfully')
    } catch (error) {
      console.error('Error deleting workflow:', error)
      toast.error('Failed to delete workflow')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!workflows.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No workflows found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.workflow_id}>
              <TableCell className="font-medium">{workflow.name}</TableCell>
              <TableCell>{workflow.description}</TableCell>
              <TableCell>{workflow.workflowTasks.length} tasks</TableCell>
              <TableCell>{new Date(workflow.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/workflows/${workflow.workflow_id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(workflow.workflow_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 