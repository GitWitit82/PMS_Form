/**
 * Forms Index Page
 * Lists all available forms and checklists in a table layout
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Plus, Pencil, ListChecks, FileInput, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  name: string
  color: string
}

interface WorkflowTask {
  name: string
  stage: string
}

interface Form {
  form_id: number
  title: string
  description: string
  type: string
  department: Department
  workflowTasks: WorkflowTask[]
}

const getFormIcon = (type: string) => {
  switch (type) {
    case 'CHECKLIST':
      return <ListChecks className="h-5 w-5 text-primary" />
    case 'DATA_ENTRY':
      return <FileInput className="h-5 w-5 text-primary" />
    case 'APPROVAL':
      return <FileCheck className="h-5 w-5 text-primary" />
    default:
      return <FileText className="h-5 w-5 text-primary" />
  }
}

const getFormTypeLabel = (type: string) => {
  switch (type) {
    case 'CHECKLIST':
      return 'Checklist'
    case 'DATA_ENTRY':
      return 'Data Entry'
    case 'APPROVAL':
      return 'Approval'
    default:
      return type
  }
}

const getFormLink = (form: Form) => {
  // Special case for panel form
  if (form.title === 'PRINT/PANEL CHECKLIST') {
    return `/forms/panel`
  }
  // Default case
  return `/forms/${form.form_id}`
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/forms')
        const responseData = await response.json()
        
        if (!response.ok) {
          const errorMessage = responseData.error || 'Failed to fetch forms'
          if (responseData.details) {
            console.error('API Error details:', responseData.details)
          }
          throw new Error(errorMessage)
        }

        if (!responseData.data) {
          throw new Error('Invalid response format: missing data property')
        }

        if (!Array.isArray(responseData.data)) {
          throw new Error('Invalid response format: data is not an array')
        }
        
        setForms(responseData.data)
      } catch (error: any) {
        console.error('Error in forms page:', error)
        toast.error(error.message || 'Failed to load forms')
        setForms([]) // Reset forms on error
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forms & Checklists</h1>
          <p className="text-muted-foreground">
            Select a form or checklist to view and fill out
          </p>
        </div>
        <Link href="/forms/builder">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No forms available</h3>
          <p className="text-sm text-muted-foreground mt-1">Create a new form to get started</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Department</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.form_id}>
                  <TableCell>
                    {getFormIcon(form.type)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {form.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {form.description}
                  </TableCell>
                  <TableCell>
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: form.department.color }}
                    >
                      {form.department.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getFormTypeLabel(form.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/forms/builder/${form.form_id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={getFormLink(form)}>
                        <Button variant="default" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 