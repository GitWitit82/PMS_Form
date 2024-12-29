/**
 * Forms Page: Form template management
 * Create and manage dynamic form templates
 */
import React from 'react'
import { Metadata } from 'next'
import { Plus } from 'lucide-react'

import { ClientLayout } from '@/components/client-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Forms | Enterprise Project Management',
  description: 'Create and manage dynamic form templates',
}

// Example form templates (in a real app, these would come from a database)
const formTemplates = [
  {
    id: '1',
    name: 'Project Initiation',
    description: 'Form for starting new projects',
    category: 'project',
    fields: 12,
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    name: 'Task Assignment',
    description: 'Assign tasks to team members',
    category: 'task',
    fields: 8,
    lastModified: '2024-01-14',
  },
  {
    id: '3',
    name: 'Resource Request',
    description: 'Request additional resources',
    category: 'resource',
    fields: 10,
    lastModified: '2024-01-13',
  },
]

export default function FormsPage() {
  return (
    <ClientLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
            <p className="text-muted-foreground">
              Create and manage form templates
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger value="project">Project Forms</TabsTrigger>
            <TabsTrigger value="task">Task Forms</TabsTrigger>
            <TabsTrigger value="resource">Resource Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium capitalize">
                          {template.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fields:</span>
                        <span className="font-medium">{template.fields}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last Modified:
                        </span>
                        <span className="font-medium">
                          {template.lastModified}
                        </span>
                      </div>
                      <div className="flex items-center justify-end space-x-2 pt-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formTemplates
                .filter((t) => t.category === 'project')
                .map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fields:</span>
                          <span className="font-medium">{template.fields}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last Modified:
                          </span>
                          <span className="font-medium">
                            {template.lastModified}
                          </span>
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-4">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Similar content for task and resource tabs */}
          <TabsContent value="task" className="space-y-6">
            {/* Task forms content */}
          </TabsContent>

          <TabsContent value="resource" className="space-y-6">
            {/* Resource forms content */}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  )
} 