/**
 * FormBuilder Component
 * A component for creating and editing forms
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormLayout } from './form-layout'
import { FormHeader } from './form-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

interface Department {
  department_id: number
  name: string
  description: string | null
  color: string
}

interface FormField {
  id: string
  type: 'text' | 'textarea' | 'checkbox' | 'select'
  label: string
  placeholder?: string
  options?: string[]
  required?: boolean
}

interface FormBuilderProps {
  formId?: string // Optional form ID for editing
  onSave?: (formData: {
    title: string
    description: string
    department_id: number
    fields: FormField[]
  }) => void
}

export function FormBuilder({ formId, onSave }: FormBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('')
  const [departments, setDepartments] = useState<Department[]>([])
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments')
        if (!response.ok) throw new Error('Failed to fetch departments')
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error('Error fetching departments:', error)
        toast.error('Failed to load departments')
      }
    }
    fetchDepartments()
  }, [])

  // Fetch form data if editing
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return

      setLoading(true)
      try {
        const response = await fetch(`/api/forms/${formId}`)
        if (!response.ok) throw new Error('Failed to fetch form')
        const data = await response.json()
        
        setTitle(data.title)
        setDescription(data.description || '')
        setInstructions(data.instructions || '')
        setSelectedDepartmentId(data.department.department_id.toString())
        
        // Transform template fields to match FormField interface
        if (data.templates[0]?.fields.items) {
          const transformedFields = data.templates[0].fields.items.map((item: any) => ({
            id: item.id.toString(),
            type: item.type,
            label: item.label,
            required: item.required,
            placeholder: item.placeholder,
            options: item.options
          }))
          setFields(transformedFields)
        }
      } catch (error) {
        console.error('Error fetching form:', error)
        toast.error('Failed to load form')
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [formId])

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  const handleSave = async () => {
    if (!title || !selectedDepartmentId) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const formData = {
        title,
        description,
        instructions,
        department_id: parseInt(selectedDepartmentId),
        fields: fields.map((field, index) => ({
          ...field,
          id: index + 1 // Reset IDs to be sequential
        }))
      }

      const url = formId ? `/api/forms/${formId}` : '/api/forms'
      const method = formId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save form')
      }

      toast.success(`Form ${formId ? 'updated' : 'created'} successfully`)
      router.push('/forms')
      router.refresh()
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Failed to save form')
    } finally {
      setLoading(false)
    }
  }

  // Get selected department details
  const selectedDepartment = departments.find(
    d => d.department_id.toString() === selectedDepartmentId
  )

  const formContent = (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <CardContent className="pt-6">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-50 hover:opacity-100">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="ml-8 space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Field label"
                  className="flex-1 mr-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Type</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value: FormField['type']) => 
                      updateField(field.id, { type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Required</Label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => 
                      updateField(field.id, { required: e.target.checked })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addField} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  )

  return (
    <FormLayout
      header={
        <FormHeader 
          title={title || 'New Form'} 
          departmentName={selectedDepartment?.name}
          departmentColor={selectedDepartment?.color}
        />
      }
      projectInfo={
        <div className="space-y-4 p-6">
          <div className="grid gap-2">
            <Label>Form Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
            />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Instructions</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter form instructions"
            />
          </div>
          <div className="grid gap-2">
            <Label>Department</Label>
            <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      {dept.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading || !title || !selectedDepartmentId}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : formId ? 'Update Form' : 'Save Form'}
          </Button>
        </div>
      }
    >
      {formContent}
    </FormLayout>
  )
} 