'use client'

import { WorkflowForm } from '@/components/workflows/workflow-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewWorkflowPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to create workflow')

      toast.success('Workflow created successfully')
      router.push('/workflows')
    } catch (error) {
      console.error('Error creating workflow:', error)
      toast.error('Failed to create workflow')
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Workflow</h1>
      <WorkflowForm 
        onSubmit={handleSubmit}
        onCancel={() => router.push('/workflows')}
      />
    </div>
  )
} 