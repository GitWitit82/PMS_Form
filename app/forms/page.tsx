/**
 * Forms Index Page
 * Lists all available forms and checklists
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, ChevronRight, Plus, Pencil } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Department {
  name: string
  color: string
}

interface Form {
  form_id: number
  title: string
  description: string
  department: Department
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms')
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to fetch forms')
        }
        const data = await response.json()
        console.log('Fetched forms:', data) // Debug log
        setForms(data)
      } catch (error) {
        console.error('Error fetching forms:', error)
        toast.error('Failed to load forms')
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="h-6 w-3/4 bg-muted rounded mt-4"></div>
                <div className="h-4 w-full bg-muted rounded mt-2"></div>
                <div className="h-5 w-20 bg-muted rounded mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No forms available</h3>
          <p className="text-sm text-muted-foreground mt-1">Create a new form to get started</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.form_id} className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/forms/builder/${form.form_id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/forms/${form.form_id}`}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardTitle className="mt-4">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
                <div className="mt-2">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: form.department.color }}
                  >
                    {form.department.name}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 