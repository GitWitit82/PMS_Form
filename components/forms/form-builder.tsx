/**
 * FormBuilder Component
 * A component for creating and editing forms with a table layout
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(field => field.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return
    }

    const newFields = [...fields]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const [movedField] = newFields.splice(index, 1)
    newFields.splice(newIndex, 0, movedField)
    setFields(newFields)
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

  return (
    <FormLayout
      header={
        <FormHeader
          title={title || 'New Form'}
          departmentName={selectedDepartment?.name || 'Select Department'}
          departmentColor={selectedDepartment?.color || '#2563eb'}
        />
      }
      instructions={
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartmentId}
                onValueChange={setSelectedDepartmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem
                      key={dept.department_id}
                      value={dept.department_id.toString()}
                    >
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter form instructions"
              rows={2}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end px-6 py-4">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Form Fields</h2>
          <Button onClick={addField} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead className="w-[100px]">Required</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === fields.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field label"
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => 
                          updateField(field.id, { required: e.target.checked })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {fields.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No fields added yet. Click "Add Field" to start building your form.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </FormLayout>
  )
} 