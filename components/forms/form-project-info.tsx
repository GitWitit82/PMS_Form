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

interface FormProjectInfoProps {
  defaultValues?: {
    client?: string
    project?: string
    vinNumber?: string
    invoiceNumber?: string
    date?: Date
  }
  onValueChange?: (field: string, value: any) => void
  readOnly?: boolean
  className?: string
}

export function FormProjectInfo({
  defaultValues = {},
  onValueChange,
  readOnly = false,
  className,
}: FormProjectInfoProps) {
  const handleChange = (field: string, value: any) => {
    if (onValueChange) {
      onValueChange(field, value)
    }
  }

  return (
    <div className={cn('grid gap-6 p-6', className)}>
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {/* Client & Project Fields */}
        <div className="space-y-2">
          <Label htmlFor="client">Client:</Label>
          <Input
            id="client"
            value={defaultValues.client || ''}
            onChange={(e) => handleChange('client', e.target.value)}
            readOnly={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project">Project:</Label>
          <Input
            id="project"
            value={defaultValues.project || ''}
            onChange={(e) => handleChange('project', e.target.value)}
            readOnly={readOnly}
          />
        </div>

        {/* VIN Number & Invoice Fields */}
        <div className="space-y-2">
          <Label htmlFor="vinNumber">VIN Number:</Label>
          <Input
            id="vinNumber"
            value={defaultValues.vinNumber || ''}
            onChange={(e) => handleChange('vinNumber', e.target.value)}
            readOnly={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice#:</Label>
          <Input
            id="invoiceNumber"
            value={defaultValues.invoiceNumber || ''}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            readOnly={readOnly}
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
                  'w-full justify-start text-left font-normal',
                  !defaultValues.date && 'text-muted-foreground'
                )}
                disabled={readOnly}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {defaultValues.date ? (
                  format(defaultValues.date, 'MM/dd/yyyy')
                ) : (
                  <span>mm/dd/yyyy</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={defaultValues.date}
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