/**
 * ChecklistForm Component
 * A complete form component that combines header, project info, and checklist
 */
'use client'

import { useState } from 'react'
import { FormHeader } from './form-header'
import { FormProjectInfo } from './form-project-info'
import { FormChecklist } from './form-checklist'
import { FormLayout } from './form-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProjectInfo {
  client?: string
  project?: string
  vinNumber?: string
  invoiceNumber?: string
  date?: Date
}

interface ChecklistFormProps {
  title: string
  departmentColor?: string
  instructions?: string
  items: Array<{ id: number; text: string }>
  defaultValues?: {
    projectInfo?: ProjectInfo
    checkedItems?: number[]
    completedBy?: string
  }
  onSubmit?: (data: {
    projectInfo: ProjectInfo
    checkedItems: number[]
    completedBy: string
  }) => void
  readOnly?: boolean
}

export function ChecklistForm({
  title,
  departmentColor,
  instructions,
  items,
  defaultValues = {},
  onSubmit,
  readOnly = false,
}: ChecklistFormProps) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(
    defaultValues.projectInfo || {}
  )
  const [checkedItems, setCheckedItems] = useState<number[]>(
    defaultValues.checkedItems || []
  )
  const [completedBy, setCompletedBy] = useState<string>(
    defaultValues.completedBy || ''
  )

  const handleProjectInfoChange = (field: string, value: any) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleChecklistItemChange = (itemId: number, checked: boolean) => {
    setCheckedItems((prev) =>
      checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId)
    )
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        projectInfo,
        checkedItems,
        completedBy,
      })
    }
  }

  const instructionsContent = instructions && (
    <div className="text-sm text-muted-foreground">
      {instructions}
    </div>
  )

  const footerContent = (
    <div className="flex justify-between items-center">
      <div className="space-y-2 flex-1 max-w-xs">
        <Label htmlFor="completedBy">Completed By:</Label>
        <Input
          id="completedBy"
          value={completedBy}
          onChange={(e) => setCompletedBy(e.target.value)}
          readOnly={readOnly}
        />
      </div>
      {!readOnly && (
        <Button
          onClick={handleSubmit}
          disabled={!completedBy || checkedItems.length !== items.length}
          className="ml-4"
        >
          Submit
        </Button>
      )}
    </div>
  )

  return (
    <FormLayout
      header={<FormHeader title={title} departmentColor={departmentColor} />}
      projectInfo={
        <FormProjectInfo
          defaultValues={projectInfo}
          onValueChange={handleProjectInfoChange}
          readOnly={readOnly}
        />
      }
      instructions={instructionsContent}
      footer={footerContent}
    >
      <FormChecklist
        items={items.map((item) => ({
          ...item,
          checked: checkedItems.includes(item.id),
        }))}
        instructions={instructions}
        onItemChange={handleChecklistItemChange}
        readOnly={readOnly}
      />
    </FormLayout>
  )
} 