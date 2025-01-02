/**
 * Forms Index Page
 * Lists all available forms and checklists in a table layout
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Plus, Pencil, ListChecks, FileInput, FileCheck, GripVertical } from 'lucide-react'
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
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Department {
  name: string
  color: string
}

interface Form {
  form_id: number
  title: string
  description: string
  type: string
  department: Department
  page: number
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

// Sortable table row component
function SortableTableRow({ form }: { form: Form }) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
  } = useSortable({ id: form.form_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[80px_2fr_2fr_120px_100px_80px_100px] gap-4 items-center p-4 border-b hover:bg-muted/50"
    >
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-grab active:cursor-grabbing"
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
          {getFormIcon(form.type)}
        </div>
      </div>
      <div className="font-medium">
        {form.title}
      </div>
      <div className="text-muted-foreground">
        {form.description}
      </div>
      <div>
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: form.department.color }}
        >
          {form.department.name}
        </span>
      </div>
      <div>
        <Badge variant="secondary">
          {getFormTypeLabel(form.type)}
        </Badge>
      </div>
      <div className="text-center">
        <Badge variant="outline">
          {form.page}
        </Badge>
      </div>
      <div>
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
      </div>
    </div>
  )
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
      
      // Sort forms by page number
      const sortedForms = [...responseData.data].sort((a, b) => a.page - b.page)
      setForms(sortedForms)
    } catch (error: any) {
      console.error('Error in forms page:', error)
      toast.error(error.message || 'Failed to load forms')
      setForms([]) // Reset forms on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) {
      return
    }

    setForms((forms) => {
      const oldIndex = forms.findIndex((form) => form.form_id === active.id)
      const newIndex = forms.findIndex((form) => form.form_id === over.id)
      
      const newForms = arrayMove(forms, oldIndex, newIndex)
      
      // Update page numbers
      const updatedForms = newForms.map((form, index) => ({
        ...form,
        page: index + 1
      }))

      // Save the new order to the database
      fetch('/api/forms/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forms: updatedForms }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to save form order')
          }
          toast.success('Form order updated successfully')
        })
        .catch((error) => {
          console.error('Error saving form order:', error)
          toast.error('Failed to save form order')
          // Refresh the forms to get the original order
          fetchForms()
        })

      return updatedForms
    })
  }

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
          <div className="w-full">
            <div className="grid grid-cols-[80px_2fr_2fr_120px_100px_80px_100px] gap-4 bg-muted p-3 text-sm font-medium">
              <div></div>
              <div>Title</div>
              <div>Description</div>
              <div>Department</div>
              <div>Type</div>
              <div className="text-center">Page</div>
              <div>Actions</div>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={forms.map(form => form.form_id)}
                strategy={verticalListSortingStrategy}
              >
                {forms.map((form) => (
                  <SortableTableRow key={form.form_id} form={form} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  )
} 