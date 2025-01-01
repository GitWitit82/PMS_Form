'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Form {
  form_id: number
  name: string
  description: string
  status: string
  template: {
    name: string
  }
}

interface FormListProps {
  forms: Form[]
  projectId: number
}

export function FormList({ forms, projectId }: FormListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Project Forms</CardTitle>
          <Button
            variant="outline"
            onClick={() => window.location.href = `/projects/${projectId}/forms/new`}
          >
            Add Form
          </Button>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No forms found for this project.
            </p>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <Card key={form.form_id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                      <Badge className={getStatusColor(form.status)}>
                        {form.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {form.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Template: {form.template.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 