export interface WorkflowVersion {
  version_id: number
  workflow_id: number
  version_number: number
  changes: any
  created_by: number
  created_at: Date
  is_active: boolean
}

export interface WorkflowDependency {
  source_task_id: number
  target_task_id: number
  dependency_type: 'start-to-start' | 'start-to-finish' | 'finish-to-start' | 'finish-to-finish'
  lag_time?: number
} 