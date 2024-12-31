/**
 * Print Panel Checklist Component
 * Main component for the print/panel checklist form
 */
'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanelSection } from "./panel-section"

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

type SectionKey = 'driver' | 'passenger' | 'back' | 'front' | 'top' | 'printCuts' | 'perf'

interface PanelSections {
  [key: string]: {
    title: string
    prefix: string
    rows: PanelRow[]
  }
}

export function PrintPanelChecklist() {
  const [sections, setSections] = useState<PanelSections>({
    driver: { title: "FILL OUT PANEL SLOTS FOR DRIVER SIDE:", prefix: "D", rows: [] },
    passenger: { title: "FILL OUT PANEL SLOTS FOR PASSENGER SIDE:", prefix: "P", rows: [] },
    back: { title: "FILL OUT PANEL SLOTS FOR BACK SIDE:", prefix: "B", rows: [] },
    front: { title: "FILL OUT PANEL SLOTS FOR FRONT SIDE:", prefix: "F", rows: [] },
    top: { title: "FILL OUT PANEL SLOTS FOR TOP:", prefix: "T", rows: [] },
    printCuts: { title: "PRINT CUTS:", prefix: "PC", rows: [] },
    perf: { title: "PERF:", prefix: "PF", rows: [] }
  })

  const addRow = (sectionKey: SectionKey) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        rows: [
          ...prev[sectionKey].rows,
          {
            id: `${sectionKey}-${Date.now()}`,
            height: "",
            width: "",
            qty: "",
            confirmSize: false,
            ripPrint: false,
            laminated: false,
            confirmPrinted: false
          }
        ]
      }
    }))
  }

  const removeRow = (sectionKey: SectionKey, id: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        rows: prev[sectionKey].rows.filter(row => row.id !== id)
      }
    }))
  }

  const updateRow = (sectionKey: SectionKey, id: string, field: keyof PanelRow, value: string | boolean) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        rows: prev[sectionKey].rows.map(row =>
          row.id === id ? { ...row, [field]: value } : row
        )
      }
    }))
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-[#2c3e7b] text-white">
        <CardTitle className="text-2xl">PRINT/PANEL CHECKLIST</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="client">Client:</Label>
            <Input id="client" className="border-b border-t-0 border-x-0 rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project">Project:</Label>
            <Input id="project" className="border-b border-t-0 border-x-0 rounded-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date:</Label>
            <Input id="date" type="date" className="border-b border-t-0 border-x-0 rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN Number:</Label>
            <Input id="vin" className="border-b border-t-0 border-x-0 rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice">Invoice#:</Label>
            <Input id="invoice" className="border-b border-t-0 border-x-0 rounded-none" />
          </div>
        </div>

        <div className="text-sm italic">
          Each item MUST be completed prior to sign off. Signature equals financial responsibility for step or any cost required to fix.
        </div>

        {/* Panel Sections */}
        <div className="space-y-8">
          {Object.entries(sections).map(([key, section]) => (
            <PanelSection
              key={key}
              title={section.title}
              rows={section.rows}
              prefix={section.prefix}
              onAddRow={() => addRow(key as SectionKey)}
              onRemoveRow={(id) => removeRow(key as SectionKey, id)}
              onUpdateRow={(id, field, value) => updateRow(key as SectionKey, id, field, value)}
            />
          ))}
        </div>

        {/* Page Number */}
        <div className="text-right text-sm text-gray-500">
          13
        </div>
      </CardContent>
    </Card>
  )
} 