'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Lock } from 'lucide-react'

interface Step {
  id: number | string
  title: string
  subtitle?: string
  color: 'blue' | 'green' | 'yellow' | 'white'
  hasInput?: boolean
  paymentOptions?: string[]
  timeOptions?: string[]
  hasLock?: boolean
}

interface WorkflowFormProps {
  projectId: number
  onSuccess?: () => void
  isNewProject?: boolean
  project?: {
    name: string
    description?: string
    Customer: {
      name: string
    }
    vin_number?: string
    invoice_number?: string
  }
}

export function WorkflowForm({ projectId, onSuccess, isNewProject = false, project }: WorkflowFormProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    project: project?.name || '',
    customer: project?.Customer?.name || '',
    description: project?.description || '',
    vin: project?.vin_number || '',
    invoice: project?.invoice_number || '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(true)

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setFormData(prev => ({
        ...prev,
        project: project.name,
        customer: project.Customer.name,
        description: project.description || '',
        vin: project.vin_number || '',
        invoice: project.invoice_number || ''
      }))
      setLoading(false)
    }
  }, [project])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const steps: Step[] = [
    // Row 1
    { id: 1, title: 'INITIAL CONTACT', subtitle: '(LEAD OR PROSPECT)', color: 'blue', hasInput: true },
    { id: '', title: 'CREATE FOLDER & TRAVELER', subtitle: 'WORK ORDER MADE', color: 'yellow', hasInput: true },
    { id: '', title: 'STICKY CREATED & PUT ON BOARD', color: 'yellow', hasInput: true },
    { id: 2, title: 'PREDEVELOPMENT MEETING', subtitle: '(PHONE / PERSON)', color: 'blue', hasInput: true },
    { id: '', title: 'INITIAL ESTIMATED INVOICE', subtitle: 'COLLECT 50% OF TOTAL PROJECT or $500 WORKING DEPOSIT', color: 'green', paymentOptions: ['PAID', 'WAIVED'] },
    
    // Row 2
    { id: 3, title: 'CREATIVE CONCEPT MEETING', subtitle: '(PHONE / PERSON)', color: 'blue', hasInput: true },
    { id: '', title: 'FOLLOW-UP EMAIL', subtitle: '(COLLECT COLLATERALS & TERMS & CONDITIONS)', color: 'yellow', hasInput: true },
    { id: 4, title: 'ROUGH MOCKUP', subtitle: '(LOW RES / NO TEMPLATE)', color: 'blue', hasInput: true },
    { id: 5, title: 'PHOTOS & SIZING', subtitle: 'SALES - OPT/UPSEL', color: 'blue', hasInput: true },
    { id: '', title: 'PHYSICAL INSP.', subtitle: 'LIST OF ADDITIONAL SERVICES SOLD / NEEDED', color: 'yellow', hasInput: true },
    { id: '', title: 'CONFIRM & UPDATE INVOICE', subtitle: 'WAIVED FEE NOW PAID, INVOICE UPDATED W/ NEW SERVICES', color: 'green', hasInput: true },
    
    // Row 3
    { id: 6, title: 'PRE-DESIGN LAYOUT MEETING', color: 'blue', hasInput: true },
    { id: 7, title: 'CREATE & VERIFY TEMPLATE', color: 'yellow', hasInput: true, hasLock: true },
    { id: 8, title: 'START HIGH-RES DESIGN', subtitle: '(HI RES / SINGLE SIDE)', color: 'blue', hasInput: true, hasLock: true },
    { id: '', title: 'ART DIRECTION SIGN OFF', color: 'yellow', hasInput: true },
    { id: '', title: 'CUSTOMER SIGN OFF', color: 'yellow', hasInput: true },
    { id: 9, title: 'FINAL DESIGN', color: 'blue', hasInput: true },
    
    // Row 4
    { id: '', title: 'INTERNAL PROOF', color: 'yellow', hasInput: true },
    { id: '', title: 'ART DIRECTION SIGN OFF', color: 'yellow', hasInput: true },
    { id: '', title: 'CUSTOMER SIGN OFF', color: 'yellow', hasInput: true },
    { id: '', title: 'CONFIRM 50% DEPOSIT', subtitle: 'IF NOT ALREADY COLLECTED', color: 'green', paymentOptions: ['CASH', 'CREDIT', 'ONLINE'] },
    { id: '', title: 'FIRM HOLD', subtitle: 'SCHEDULE INSTALL DROP OFF', color: 'yellow', timeOptions: ['DROP OFF:', 'ON-SITE'] },
    { id: '', title: 'ORDER RAW MATERIALS', color: 'yellow', hasInput: true },
    
    // Row 5
    { id: '', title: 'INSTALLER SHEET MADE', color: 'yellow', hasInput: true },
    { id: 10, title: 'PRINT READY FILES BLUEPRINTS & REVIEW', color: 'blue', hasInput: true },
    { id: '', title: 'PRE-INSTALL MEETING', color: 'yellow', hasInput: true },
    { id: 11, title: 'PANELING', color: 'blue', hasInput: true },
    { id: 12, title: 'PRINTING', color: 'blue', hasInput: true },
    { id: 13, title: 'LAMINATION ROUGH Q.C.', color: 'blue', hasInput: true },
    { id: 14, title: 'TRIM & SEW', color: 'blue', hasInput: true },
    
    // Row 6
    { id: 15, title: 'PLOT', color: 'blue', hasInput: true },
    { id: 16, title: 'PROJECT INVENTORY CONTROL / Q.C.', color: 'yellow', hasInput: true },
    { id: 17, title: 'INTAKE OF ITEM', subtitle: 'ESOK', color: 'blue', hasInput: true },
    { id: '', title: 'WRAP PLAN SET-UP', subtitle: 'ESOK AFTER $', color: 'yellow', hasInput: true },
    { id: 18, title: 'REPAIRS & VINYL/ADHESIVE REMOVAL', subtitle: 'ESOK AFTER $', color: 'blue', hasInput: true },
    { id: 19, title: 'CLEAN & PREP REMOVALS', color: 'blue', hasInput: true },
    { id: 20, title: 'DRY HANG & PHOTO', color: 'blue', hasInput: true },
    
    // Row 7
    { id: 21, title: 'INSTALL', subtitle: 'ON-LOCATION', color: 'blue', hasInput: true },
    { id: 22, title: 'POST WRAP', color: 'yellow', hasInput: true },
    { id: 23, title: 'Q.C. & PHOTOS', color: 'yellow', hasInput: true },
    { id: '', title: 'BALANCE', subtitle: 'ESOK', color: 'green', paymentOptions: ['CASH', 'CREDIT', 'ONLINE', 'CHECK', 'NET'] },
    { id: 24, title: 'REVEAL', color: 'green', timeOptions: ['CONFIRMED', 'FLEXIBLE'], subtitle: '9:30AM / 4:30PM' },
    { id: 25, title: 'DEBRIEF ALL DEPTS.', color: 'white', hasInput: true },
    
    // Final Row
    { id: 26, title: 'CLOSE PROJECT', subtitle: '(FILE ALL PAPERWORK, UPDATE WEBSITE & FACEBOOK)', color: 'yellow', hasInput: true }
  ]

  const getColorClass = (color: Step['color']) => {
    switch (color) {
      case 'blue':
        return 'bg-sky-100 border-sky-300'
      case 'green':
        return 'bg-green-100 border-green-300'
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300'
      default:
        return 'bg-white border-gray-300'
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading workflow...</div>
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg border bg-background">
      <div className="p-4 max-w-[1400px] mx-auto bg-white">
        {isNewProject && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-name" className="text-xs">Project Name</Label>
              <Input id="project-name" className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label htmlFor="customer" className="text-xs">Customer</Label>
              <Input id="customer" className="mt-1 h-8 text-sm" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Input id="description" className="mt-1 h-8 text-sm" />
            </div>
          </div>
        )}

        <div className="grid gap-1 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {steps.map((step, index) => (
            <div key={`${step.id}-${index}`} className="flex flex-col">
              <Card className={`p-2 ${getColorClass(step.color)} border-2 h-full relative`}>
                <div className="flex flex-col h-full">
                  {step.id && (
                    <div className="absolute top-0 left-0 bg-white px-2 py-1 text-xs font-bold rounded-br">{step.id}</div>
                  )}
                  {step.hasLock && (
                    <div className="absolute top-0 right-0 p-1">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 pt-4">
                    <h3 className="font-bold text-xs uppercase">{step.title}</h3>
                    {step.subtitle && (
                      <p className="text-[10px] text-gray-600 mt-1 uppercase">{step.subtitle}</p>
                    )}
                    {step.hasInput && (
                      <Input 
                        type="text" 
                        className="text-xs mt-2 h-6 px-1"
                      />
                    )}
                    {step.paymentOptions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.paymentOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <Checkbox id={`${index}-${option}`} className="w-3 h-3" />
                            <Label htmlFor={`${index}-${option}`} className="text-[10px]">{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.timeOptions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.timeOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-1">
                            <Checkbox id={`${index}-${option}`} className="w-3 h-3" />
                            <Label htmlFor={`${index}-${option}`} className="text-[10px]">{option}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              {index < steps.length - 1 && index % 6 !== 5 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="text-gray-400 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-4 bg-red-100 p-4 rounded-lg">
          <div className="text-center font-bold mb-4 text-red-800 text-sm">
            *SIGN OFF = STEP 100% COMPLETE - PROJ. MANAGER & DEPT. MUST SIGN OFF BEFORE PROCEEDING TO NEXT STEP*
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project" className="text-xs">PROJECT:</Label>
              <Input 
                id="project" 
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
                className="mt-1 h-8 text-sm" 
                readOnly={!isNewProject}
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-xs">DATE:</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1 h-8 text-sm" 
              />
            </div>
            <div>
              <Label htmlFor="vin" className="text-xs">VIN #:</Label>
              <Input 
                id="vin" 
                value={formData.vin}
                onChange={(e) => handleInputChange('vin', e.target.value)}
                className="mt-1 h-8 text-sm" 
              />
            </div>
            <div>
              <Label htmlFor="invoice" className="text-xs">INVOICE #:</Label>
              <Input 
                id="invoice" 
                value={formData.invoice}
                onChange={(e) => handleInputChange('invoice', e.target.value)}
                className="mt-1 h-8 text-sm" 
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {['FULL WRAP', 'PARTIAL', 'DECALS', 'PERF', 'REMOVAL', '3RD PARTY', 'BODYWORK'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type} className="w-4 h-4" />
                <Label htmlFor={type} className="text-xs">{type}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 