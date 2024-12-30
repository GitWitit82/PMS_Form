/**
 * DepartmentColorPicker: Component for selecting department colors
 * Provides a color input with preview and hex value display
 */
'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DepartmentColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

export function DepartmentColorPicker({
  color,
  onChange,
  className,
}: DepartmentColorPickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="department-color">Department Color</Label>
      <div className="flex items-center gap-4">
        <div
          className="h-10 w-10 rounded-md border"
          style={{ backgroundColor: color }}
        />
        <Input
          id="department-color"
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 cursor-pointer"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  )
} 