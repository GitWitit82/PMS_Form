/**
 * FormHeader Component
 * Displays the department-specific header for forms
 */
'use client'

import { cn } from '@/lib/utils'

interface FormHeaderProps {
  title: string
  departmentColor?: string
  className?: string
}

const defaultColor = 'bg-blue-700' // Default blue as shown in the image

export function FormHeader({ title, departmentColor = defaultColor, className }: FormHeaderProps) {
  return (
    <div className={cn('w-full px-6 py-4', departmentColor, className)}>
      <h1 className="text-xl font-bold text-white tracking-wide">
        {title}
      </h1>
    </div>
  )
} 