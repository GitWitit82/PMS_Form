/**
 * WorkflowList Component
 * Displays a list of workflows with their associated tasks
 */
'use client'

import { useState } from 'react'
import { Workflow, WorkflowTask } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PlusCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type WorkflowWithTasks = Workflow & {
  workflowTasks: WorkflowTask[]
}

interface WorkflowListProps {
  workflows: WorkflowWithTasks[]
  onCreateWorkflow?: () => void
  onEditWorkflow?: (workflow: WorkflowWithTasks) => void
  onDeleteWorkflow?: (workflowId: number) => void
}

export function WorkflowList({
  workflows,
  onCreateWorkflow,
  onEditWorkflow,
  onDeleteWorkflow,
}: WorkflowListProps) {
  const [expandedWorkflows, setExpandedWorkflows] = useState<number[]>([])

  const toggleWorkflow = (workflowId: number) => {
    setExpandedWorkflows((prev) =>
      prev.includes(workflowId)
        ? prev.filter((id) => id !== workflowId)
        : [...prev, workflowId]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workflows</h2>
        <Button onClick={onCreateWorkflow}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <TableRow key={workflow.workflow_id}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleWorkflow(workflow.workflow_id)}
                >
                  {expandedWorkflows.includes(workflow.workflow_id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-medium">{workflow.name}</TableCell>
              <TableCell>{workflow.description}</TableCell>
              <TableCell>{formatDate(workflow.created_at)}</TableCell>
              <TableCell>{workflow.workflowTasks.length} tasks</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditWorkflow?.(workflow)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteWorkflow?.(workflow.workflow_id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Expanded Task Details */}
      {workflows.map((workflow) =>
        expandedWorkflows.includes(workflow.workflow_id) ? (
          <div key={`tasks-${workflow.workflow_id}`} className="pl-8 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflow.workflowTasks.map((task) => (
                  <TableRow key={task.workflow_task_id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.stage}</TableCell>
                    <TableCell>
                      {task.scheduled_start_date
                        ? formatDate(task.scheduled_start_date)
                        : 'Not set'}
                    </TableCell>
                    <TableCell>
                      {task.scheduled_end_date
                        ? formatDate(task.scheduled_end_date)
                        : 'Not set'}
                    </TableCell>
                    <TableCell>{task.priority || 'Normal'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null
      )}
    </div>
  )
} 