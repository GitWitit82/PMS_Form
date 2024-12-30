/**
 * Forms Index Page
 * Lists all available forms and checklists
 */
'use client'

import Link from 'next/link'
import { FileText, ChevronRight, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const AVAILABLE_FORMS = [
  {
    id: 'lamination-trimming',
    title: 'Lamination & Trimming Checklist',
    description: 'Quality control checklist for lamination and trimming processes',
    department: 'Production',
    color: 'bg-blue-700',
  },
  // Add more forms here as they become available
]

export default function FormsPage() {
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AVAILABLE_FORMS.map((form) => (
          <Link key={form.id} href={`/forms/${form.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${form.color} text-white`}>
                    {form.department}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 