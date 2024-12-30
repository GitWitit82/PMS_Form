/**
 * Form Builder Edit Page
 * Allows editing of existing forms
 */
'use client'

import { useParams } from 'next/navigation'
import { FormBuilder } from '@/components/forms/form-builder'

export default function FormBuilderEditPage() {
  const params = useParams()

  return (
    <div className="container py-8">
      <FormBuilder formId={params.id as string} />
    </div>
  )
} 