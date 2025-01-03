import { Task, TaskStatus, Workflow as PrismaWorkflow } from '@prisma/client'

export interface WorkflowTask extends Task {
  task_id: number
  name: string
  description: string | null
  status: TaskStatus
  order: number
  workflow_id: number
  department_id: number | null
  resource_id: number | null
  scheduled_start_time: Date | null
  scheduled_start_date: Date | null
  scheduled_end_time: Date | null
  scheduled_end_date: Date | null
  actual_start: Date | null
  actual_end: Date | null
  priority: string | null
  stage: string | null
  progress: number
  estimated_duration: number | null
  created_at: Date
  updated_at: Date
  dependencies?: WorkflowTask[]
  dependents?: WorkflowTask[]
}

export interface Workflow extends PrismaWorkflow {
  workflow_id: number
  name: string
  description: string | null
  project_id: number
  created_at: Date
  updated_at: Date
  tasks: WorkflowTask[]
} 