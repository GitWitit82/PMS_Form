/**
 * Form Builder Page
 * Allows users to create and customize forms
 */
'use client'

import { FormBuilder } from '@/components/forms/form-builder'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function FormBuilderPage() {
  const router = useRouter()

  const handleSave = async (formData: {
    title: string
    description: string
    department: string
    fields: any[]
  }) => {
    try {
      // TODO: Implement form saving logic
      console.log('Form data:', formData)
      toast.success('Form saved successfully')
      router.push('/forms')
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Failed to save form')
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Builder</h1>
        <p className="text-muted-foreground">
          Create and customize forms for your organization
        </p>
      </div>

      <FormBuilder onSave={handleSave} />
    </div>
  )
} 