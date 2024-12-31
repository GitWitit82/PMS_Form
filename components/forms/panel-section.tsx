/**
 * Panel Section Component
 * Handles individual sections of the panel form with dynamic rows
 */
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2 } from 'lucide-react'

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

interface PanelSectionProps {
  title: string
  rows: PanelRow[]
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  onUpdateRow: (id: string, field: keyof PanelRow, value: string | boolean) => void
  prefix: string
}

export function PanelSection({
  title,
  rows,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  prefix
}: PanelSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase">{title}</h3>
        <Button onClick={onAddRow} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_repeat(4,80px)] gap-2 bg-gray-100 p-3 text-sm font-medium">
          <div>DIMENSIONS</div>
          <div>QTY</div>
          <div className="text-center">CONFIRM SIZE</div>
          <div className="text-center">RIP/PRINT</div>
          <div className="text-center">LAMINATED</div>
          <div className="text-center">CONFIRM PRINTED</div>
        </div>
        <div className="divide-y">
          {rows.map((row, index) => (
            <div key={row.id} className="grid grid-cols-[1fr_100px_repeat(4,80px)] gap-2 p-3 items-center">
              <div className="flex items-center gap-2">
                <div className="w-8">{prefix}{index + 1}</div>
                <div className="flex items-center gap-1">
                  <Label className="text-sm">H</Label>
                  <Input
                    value={row.height}
                    onChange={(e) => onUpdateRow(row.id, 'height', e.target.value)}
                    className="w-20"
                  />
                  <Label className="text-sm">x W</Label>
                  <Input
                    value={row.width}
                    onChange={(e) => onUpdateRow(row.id, 'width', e.target.value)}
                    className="w-20"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveRow(row.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
              <Input
                value={row.qty}
                onChange={(e) => onUpdateRow(row.id, 'qty', e.target.value)}
                className="w-20"
              />
              {['confirmSize', 'ripPrint', 'laminated', 'confirmPrinted'].map((field) => (
                <div key={field} className="flex justify-center">
                  <RadioGroup
                    value={row[field as keyof PanelRow] ? "checked" : "unchecked"}
                    onValueChange={(value) => 
                      onUpdateRow(row.id, field as keyof PanelRow, value === "checked")
                    }
                  >
                    <RadioGroupItem value="checked" className="h-5 w-5" />
                  </RadioGroup>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 