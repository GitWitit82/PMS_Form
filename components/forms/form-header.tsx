/**
 * FormHeader: Header component for forms
 * Displays form title with department-specific styling
 */
'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FormHeaderProps {
  title: string
  departmentName?: string
  departmentColor?: string
  className?: string
}

export function FormHeader({
  title,
  departmentName,
  departmentColor = '#2563eb', // Default blue color
  className,
}: FormHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 rounded-t-lg p-6 text-white',
        className
      )}
      style={{ backgroundColor: departmentColor }}
    >
      <h2 className="text-2xl font-semibold leading-none tracking-tight">
        {title}
      </h2>
      {departmentName && (
        <p className="text-sm text-white/80">{departmentName}</p>
      )}
    </div>
  )
} 