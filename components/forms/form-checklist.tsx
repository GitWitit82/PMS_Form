/**
 * FormChecklist Component
 * Displays a numbered checklist with checkboxes
 */
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  id: number
  text: string
  checked?: boolean
}

interface FormChecklistProps {
  items: ChecklistItem[]
  instructions?: string
  onItemChange?: (itemId: number, checked: boolean) => void
  readOnly?: boolean
  className?: string
}

export function FormChecklist({
  items,
  instructions,
  onItemChange,
  readOnly = false,
  className,
}: FormChecklistProps) {
  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    if (onItemChange && !readOnly) {
      onItemChange(itemId, checked)
    }
  }

  return (
    <div className={cn('space-y-6 p-6', className)}>
      {/* Instructions */}
      {instructions && (
        <p className="text-sm italic text-muted-foreground">
          {instructions}
        </p>
      )}

      {/* Tasks Section Header */}
      <div className="bg-black text-white px-4 py-2">
        <h2 className="font-semibold">TASKS</h2>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 text-sm"
          >
            {/* Item Number */}
            <span className="w-6 font-medium">{item.id}</span>

            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(item.id, checked as boolean)
                }
                disabled={readOnly}
              />
            </div>

            {/* Item Text */}
            <Label
              htmlFor={`item-${item.id}`}
              className="flex-1 leading-tight cursor-pointer"
            >
              {item.text}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
} 