import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProjectWorkflowProps {
  projectId: number
  workflowId: number
}

export const ProjectWorkflow = ({ projectId, workflowId }: ProjectWorkflowProps) => {
  const [tasks, setTasks] = useState([])
  const [progress, setProgress] = useState(0)

  // Implementation details...
} 