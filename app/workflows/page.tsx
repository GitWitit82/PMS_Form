/**
 * Workflows Page
 * Displays and manages workflows
 */
'use client'

import { Button } from '@/components/ui/button'
import { WorkflowList } from '@/components/workflows/workflow-list'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function WorkflowsPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Workflows</h1>
          <p className="text-muted-foreground">
            Manage and create workflow templates
          </p>
        </div>
        <Link href="/workflows/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>
      <WorkflowList />
    </div>
  )
} 