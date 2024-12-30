/**
 * FormLayout Component
 * A reusable layout component for all forms in the application
 */
'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormLayoutProps {
  header?: ReactNode
  projectInfo?: ReactNode
  instructions?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function FormLayout({
  header,
  projectInfo,
  instructions,
  children,
  footer,
  className,
}: FormLayoutProps) {
  return (
    <Card className={cn('max-w-4xl mx-auto', className)}>
      {/* Form Header */}
      {header && (
        <CardHeader className="p-0">
          {header}
        </CardHeader>
      )}

      <CardContent className="p-0">
        {/* Project Information Section */}
        {projectInfo && (
          <div className="border-b">
            {projectInfo}
          </div>
        )}

        {/* Instructions Section */}
        {instructions && (
          <div className="p-6 border-b bg-muted/50">
            {instructions}
          </div>
        )}

        {/* Main Form Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className="border-t p-6">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 