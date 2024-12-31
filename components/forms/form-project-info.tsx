/**
 * FormProjectInfo Component
 * Displays project-related information at the top of forms
 */
'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface FormProjectInfoProps {
  defaultValues?: {
    client?: string
    project?: string
    vinNumber?: string
    invoiceNumber?: string
    date?: Date
  }
  project?: {
    name: string
    Customer: {
      name: string
    }
    vin_number?: string
    invoice_number?: string
  }
  onValueChange?: (field: string, value: any) => void
  readOnly?: boolean
  className?: string
}

export function FormProjectInfo({
  defaultValues = {},
  project,
  onValueChange,
  readOnly = false,
  className,
}: FormProjectInfoProps) {
  const [formData, setFormData] = useState({
    client: defaultValues.client || project?.Customer?.name || '',
    project: defaultValues.project || project?.name || '',
    vinNumber: defaultValues.vinNumber || project?.vin_number || '',
    invoiceNumber: defaultValues.invoiceNumber || project?.invoice_number || '',
    date: defaultValues.date || new Date()
  })

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData(prev => ({
        ...prev,
        client: project.Customer.name,
        project: project.name,
        vinNumber: project.vin_number || '',
        invoiceNumber: project.invoice_number || ''
      }))
    }
  }, [project])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (onValueChange) {
      onValueChange(field, value)
    }
  }

  return (
    <div className={cn('grid gap-6 p-6 bg-pink-100 rounded-lg', className)}>
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {/* Client & Project Fields */}
        <div className="space-y-2">
          <Label htmlFor="client">Client:</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => handleChange('client', e.target.value)}
            readOnly={readOnly}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project">Project:</Label>
          <Input
            id="project"
            value={formData.project}
            onChange={(e) => handleChange('project', e.target.value)}
            readOnly={readOnly}
            className="bg-white"
          />
        </div>

        {/* VIN Number & Invoice Fields */}
        <div className="space-y-2">
          <Label htmlFor="vinNumber">VIN Number:</Label>
          <Input
            id="vinNumber"
            value={formData.vinNumber}
            onChange={(e) => handleChange('vinNumber', e.target.value)}
            readOnly={readOnly}
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice#:</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            readOnly={readOnly}
            className="bg-white"
          />
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Label>Date:</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-white',
                  !formData.date && 'text-muted-foreground'
                )}
                disabled={readOnly}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, 'MM/dd/yyyy')
                ) : (
                  <span>mm/dd/yyyy</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleChange('date', date)}
                disabled={readOnly}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
} 