/**
 * FormBuilder Component
 * A component for creating and customizing forms
 */
'use client'

import { useState } from 'react'
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

interface FormField {
  id: string
  type: 'text' | 'textarea' | 'checkbox' | 'select'
  label: string
  placeholder?: string
  options?: string[] // For select fields
  required?: boolean
}

interface FormBuilderProps {
  onSave?: (formData: {
    title: string
    description: string
    department: string
    fields: FormField[]
  }) => void
}

const DEPARTMENT_COLORS = {
  'Production': 'bg-blue-700',
  'Quality Control': 'bg-green-700',
  'Engineering': 'bg-purple-700',
  'Maintenance': 'bg-orange-700',
  'Safety': 'bg-red-700',
}

export function FormBuilder({ onSave }: FormBuilderProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState<string>('')
  const [fields, setFields] = useState<FormField[]>([])

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

  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        description,
        department,
        fields,
      })
    }
  }

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
                <div className="grid gap-2 flex-1 mr-4">
                  <Label>Field Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </div>
                <div className="grid gap-2 w-[180px] mr-4">
                  <Label>Field Type</Label>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-end"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>Placeholder</Label>
                <Input
                  value={field.placeholder}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </div>

              {field.type === 'select' && (
                <div className="grid gap-2">
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join('\n')}
                    onChange={(e) => updateField(field.id, { 
                      options: e.target.value.split('\n').filter(Boolean)
                    })}
                    placeholder="Enter options (one per line)"
                  />
                </div>
              )}
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
          departmentColor={department ? DEPARTMENT_COLORS[department as keyof typeof DEPARTMENT_COLORS] : undefined} 
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
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(DEPARTMENT_COLORS).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!title || !department}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      }
    >
      {formContent}
    </FormLayout>
  )
} 