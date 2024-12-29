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
  try {
    return await prisma.workflow.findMany({
      include: {
        steps: true,
        user_creator: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return []
  }
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
                A list of all workflow templates and their steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No workflows found. Create your first workflow template.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workflows.map((workflow) => (
                      <TableRow key={workflow.workflow_id}>
                        <TableCell className="font-medium">
                          {workflow.name}
                        </TableCell>
                        <TableCell>
                          {workflow.description || 'No description'}
                        </TableCell>
                        <TableCell>{workflow.steps.length}</TableCell>
                        <TableCell>{workflow.user_creator.username}</TableCell>
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
                    ))
                  )}
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
                {workflows.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No recent activity
                  </div>
                ) : (
                  workflows.slice(0, 5).map((workflow) => (
                    <div
                      key={workflow.workflow_id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workflow.description || 'No description'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created by {workflow.user_creator.username}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(workflow.created_at, 'MMM d, yyyy')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  )
} 