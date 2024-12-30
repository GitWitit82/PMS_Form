/**
 * Form Detail Page
 * Displays a specific form and its checklist items
 */
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormLayout } from '@/components/forms/form-layout'
import { FormHeader } from '@/components/forms/form-header'
import { FormProjectInfo } from '@/components/forms/form-project-info'
import { FormChecklist } from '@/components/forms/form-checklist'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

interface FormTemplate {
  template_id: number
  name: string
  fields: {
    items: Array<{
      id: number
      type: string
      label: string
      required: boolean
    }>
  }
  layout: {
    sections: Array<{
      title: string
      description: string
      fields: number[]
    }>
  }
}

interface Form {
  form_id: number
  title: string
  description: string
  instructions: string
  department: {
    name: string
    color: string
  }
  templates: FormTemplate[]
}

export default function FormDetailPage() {
  const params = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectInfo, setProjectInfo] = useState({
    client: '',
    project: '',
    vinNumber: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`)
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to fetch form')
        }
        const data = await response.json()
        console.log('Fetched form:', data) // Debug log
        setForm(data)
        
        // Initialize checked items
        if (data.templates[0]?.fields.items) {
          const initialCheckedItems = data.templates[0].fields.items.reduce(
            (acc: Record<number, boolean>, item: { id: number }) => {
              acc[item.id] = false
              return acc
            },
            {}
          )
          setCheckedItems(initialCheckedItems)
        }
      } catch (error) {
        console.error('Error fetching form:', error)
        toast.error('Failed to load form')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchForm()
    }
  }, [params.id])

  const handleProjectInfoChange = (field: string, value: string) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckItem = (id: number, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = async () => {
    try {
      // TODO: Implement form submission
      toast.success('Form saved successfully')
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Failed to save form')
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-20 bg-muted rounded-lg mb-6"></div>
          <div className="h-40 bg-muted rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Form not found</h2>
          <p className="text-muted-foreground mt-2">The requested form could not be found.</p>
        </div>
      </div>
    )
  }

  const template = form.templates[0]
  if (!template) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">No template available</h2>
          <p className="text-muted-foreground mt-2">This form does not have an active template.</p>
        </div>
      </div>
    )
  }

  return (
    <FormLayout
      header={
        <FormHeader 
          title={form.title}
          departmentName={form.department.name}
          departmentColor={form.department.color}
        />
      }
      projectInfo={
        <FormProjectInfo
          data={projectInfo}
          onChange={handleProjectInfoChange}
        />
      }
      instructions={form.instructions}
      footer={
        <div className="flex justify-end px-6 py-4">
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <FormChecklist
          items={template.fields.items}
          checkedItems={checkedItems}
          onCheck={handleCheckItem}
        />
      </div>
    </FormLayout>
  )
} 