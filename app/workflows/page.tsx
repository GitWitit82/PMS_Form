/**
 * Workflows Page: Workflow template management
 * Create and manage workflow templates with steps and conditions
 */
import React from 'react'
import { Metadata } from 'next'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { ClientLayout } from '@/components/client-layout'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Workflows | Enterprise Project Management',
  description: 'Create and manage workflow templates',
}

async function getWorkflows() {
  return prisma.workflow.findMany({
    include: {
      WorkflowTask: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

export default async function WorkflowsPage() {
  const workflows = await getWorkflows()

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground">
              Create and manage workflow templates
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                A list of all workflow templates and their tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.workflow_id}>
                      <TableCell className="font-medium">
                        {workflow.name}
                      </TableCell>
                      <TableCell>
                        {workflow.description || 'No description'}
                      </TableCell>
                      <TableCell>{workflow.WorkflowTask.length}</TableCell>
                      <TableCell>
                        {format(workflow.created_at, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Clone
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent changes to workflow templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.slice(0, 5).map((workflow) => (
                  <div
                    key={workflow.workflow_id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description || 'No description'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(workflow.created_at, 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  )
} 