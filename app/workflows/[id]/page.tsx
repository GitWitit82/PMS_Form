'use client'

import { WorkflowForm } from '@/components/workflows/workflow-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function EditWorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflows/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch workflow')
        const data = await response.json()
        setWorkflow(data)
      } catch (error) {
        console.error('Error fetching workflow:', error)
        toast.error('Failed to load workflow')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflow()
  }, [params.id])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/workflows/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update workflow')

      toast.success('Workflow updated successfully')
      router.push('/workflows')
    } catch (error) {
      console.error('Error updating workflow:', error)
      toast.error('Failed to update workflow')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Workflow</h1>
      <WorkflowForm 
        workflow={workflow}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/workflows')}
      />
    </div>
  )
} 