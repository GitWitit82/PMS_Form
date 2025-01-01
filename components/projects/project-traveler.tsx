'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface ProjectTravelerProps {
  project: {
    project_id: number
    name: string
    description: string
    status: string
    created_at: string
    Customer: {
      name: string
      email: string
      phone: string
    }
    vin_number?: string
    invoice_number?: string
  }
}

export function ProjectTraveler({ project }: ProjectTravelerProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">Project Traveler</h1>
        <Button onClick={handlePrint} variant="outline">
          Print Traveler
        </Button>
      </div>

      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Created on {format(new Date(project.created_at), 'PPP')}
              </p>
            </div>
            <Badge
              className={
                project.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p>Name: {project.Customer.name}</p>
                <p>Email: {project.Customer.email}</p>
                <p>Phone: {project.Customer.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Project Details</h3>
              <div className="space-y-1">
                <p>VIN Number: {project.vin_number || 'N/A'}</p>
                <p>Invoice Number: {project.invoice_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Sign-Off Checklist</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Initial Inspection',
                'Materials Ordered',
                'Design Approved',
                'Installation Complete',
                'Quality Check',
                'Customer Sign-Off',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center space-x-2 border p-3 rounded-md"
                >
                  <div className="w-5 h-5 border rounded-sm" />
                  <span>{item}</span>
                  <div className="flex-1" />
                  <div className="border-b border-dotted w-32" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Notes</h3>
            <div className="border-t border-dashed pt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-dotted py-4" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 