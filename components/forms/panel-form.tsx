/**
 * Dynamic Panel Form Component
 * Allows users to add and manage panel sections for different sides of a vehicle
 */
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { FormLayout } from '@/components/forms/form-layout'
import { FormHeader } from '@/components/forms/form-header'
import { FormProjectInfo } from '@/components/forms/form-project-info'
import { Checkbox } from '@/components/ui/checkbox'

interface PanelRow {
  id: string
  height: string
  width: string
  qty: string
  confirmSize: boolean
  ripPrint: boolean
  laminated: boolean
  confirmPrinted: boolean
}

interface PanelSections {
  [key: string]: PanelRow[]
}

interface ProjectInfo {
  client: string
  project: string
  vinNumber: string
  invoiceNumber: string
  date: string
}

interface PanelFormProps {
  title: string
  departmentName: string
  departmentColor: string
}

export function PanelForm({ title, departmentName, departmentColor }: PanelFormProps) {
  const [sections, setSections] = useState<PanelSections>({
    DRIVER_SIDE: [],
    PASSENGER_SIDE: [],
    BACK_SIDE: [],
    FRONT_SIDE: [],
    TOP: [],
    PRINT_CUTS: [],
    PERF: []
  })

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    client: '',
    project: '',
    vinNumber: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0]
  })

  const addRow = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: [...prev[section], {
        id: `${section}-${prev[section].length + 1}`,
        height: '',
        width: '',
        qty: '',
        confirmSize: false,
        ripPrint: false,
        laminated: false,
        confirmPrinted: false
      }]
    }))
  }

  const handleProjectInfoChange = (field: string, value: string) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (section: string, rowId: string, field: string, value: string | boolean) => {
    setSections(prev => ({
      ...prev,
      [section]: prev[section].map(row => 
        row.id === rowId ? { ...row, [field]: value } : row
      )
    }))
  }

  const renderSection = (title: string, section: string) => (
    <Card className="mb-4">
      <CardHeader className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="font-bold">FILL OUT PANEL SLOTS FOR {title}:</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => addRow(section)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </CardHeader>
      
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-muted font-medium text-sm w-24">ID</th>
              <th className="p-2 border bg-muted font-medium text-sm w-48">H × W</th>
              <th className="p-2 border bg-muted font-medium text-sm w-24">QTY</th>
              <th className="p-2 border bg-muted font-medium text-sm">CONFIRM SIZE</th>
              <th className="p-2 border bg-muted font-medium text-sm">RIP/PRINT</th>
              <th className="p-2 border bg-muted font-medium text-sm">LAMINATED</th>
              <th className="p-2 border bg-muted font-medium text-sm">CONFIRM PRINTED</th>
            </tr>
          </thead>
          <tbody>
            {sections[section].map((row, index) => (
              <tr key={row.id} className="hover:bg-muted/50">
                <td className="p-2 border font-medium text-center">
                  {`${section.charAt(0)}${index + 1}`}
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">H</span>
                    <input 
                      type="text" 
                      className="w-16 p-1 border rounded" 
                      value={row.height}
                      onChange={(e) => handleInputChange(section, row.id, 'height', e.target.value)}
                    />
                    <span>×</span>
                    <span className="text-sm font-medium">W</span>
                    <input 
                      type="text" 
                      className="w-16 p-1 border rounded"
                      value={row.width}
                      onChange={(e) => handleInputChange(section, row.id, 'width', e.target.value)}
                    />
                  </div>
                </td>
                <td className="p-2 border">
                  <input 
                    type="text" 
                    className="w-full p-1 border rounded"
                    value={row.qty}
                    onChange={(e) => handleInputChange(section, row.id, 'qty', e.target.value)}
                  />
                </td>
                <td className="p-2 border text-center">
                  <Checkbox
                    checked={row.confirmSize}
                    onCheckedChange={(checked) => handleInputChange(section, row.id, 'confirmSize', !!checked)}
                  />
                </td>
                <td className="p-2 border text-center">
                  <Checkbox
                    checked={row.ripPrint}
                    onCheckedChange={(checked) => handleInputChange(section, row.id, 'ripPrint', !!checked)}
                  />
                </td>
                <td className="p-2 border text-center">
                  <Checkbox
                    checked={row.laminated}
                    onCheckedChange={(checked) => handleInputChange(section, row.id, 'laminated', !!checked)}
                  />
                </td>
                <td className="p-2 border text-center">
                  <Checkbox
                    checked={row.confirmPrinted}
                    onCheckedChange={(checked) => handleInputChange(section, row.id, 'confirmPrinted', !!checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )

  return (
    <FormLayout
      header={
        <FormHeader 
          title={title}
          departmentName={departmentName}
          departmentColor={departmentColor}
        />
      }
      projectInfo={
        <FormProjectInfo
          data={projectInfo}
          onChange={handleProjectInfoChange}
        />
      }
      instructions={
        <p className="text-sm text-muted-foreground italic">
          Each item MUST be completed prior to sign off. Signature equals financial responsibility for step or any cost required to fix.
        </p>
      }
    >
      <div className="space-y-6 p-6">
        {Object.entries(sections).map(([key, _]) => 
          renderSection(key.replace(/_/g, ' '), key)
        )}
      </div>
    </FormLayout>
  )
} 