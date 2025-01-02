import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ProgressTrackerProps {
  entityId: number
  entityType: 'project' | 'workflow' | 'form'
}

export const ProgressTracker = ({ entityId, entityType }: ProgressTrackerProps) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')

  // Implementation details...
} 