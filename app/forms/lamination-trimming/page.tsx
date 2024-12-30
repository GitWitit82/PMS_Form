/**
 * Lamination & Trimming Checklist Page
 */
'use client'

import { ChecklistForm } from '@/components/forms/checklist-form'

const LAMINATION_CHECKLIST_ITEMS = [
  {
    id: 1,
    text: 'CONFIRMED WHETHER LAMINATION IS NEEDED OR NOT, CHECK PRINT PAPERWORK',
  },
  {
    id: 2,
    text: 'Confirmed there is enough lamination to complete your project Or have a plan and keep a close eye on the lamination so you can change it in between panels if possible',
  },
  {
    id: 3,
    text: 'Load vinyl roll on proper bar depending on length of project Tap roll on ground to secure roll is even along edge. Lamination bar further under should be used for long runs',
  },
  {
    id: 4,
    text: 'Attached take up real for long runs or if you are laminating alone',
  },
  {
    id: 5,
    text: 'Reviewed panels while lamination occurs for obvious issues',
  },
  {
    id: 6,
    text: 'Swiffered panels as they are being laminated to reduce lint, dirt ect.',
  },
  {
    id: 7,
    text: 'Confirmed panels that are laminated - if possible may need to occur during trim; CHECKLIST',
  },
  {
    id: 8,
    text: 'Trimmed panels leaving 5" at both ends of Print Cut files and removing excess lamination!',
  },
  {
    id: 9,
    text: 'Trim panels that need to be sewn together and compare edges to confirm color matches',
  },
  {
    id: 10,
    text: 'Confirm COMPLETE panel inventory and package/cart project for installation; CHECKLIST',
  },
]

export default function LaminationTrimmingPage() {
  const handleSubmit = async (data: any) => {
    // TODO: Implement form submission
    console.log('Form submitted:', data)
  }

  return (
    <div className="container py-8">
      <ChecklistForm
        title="LAMINATION & TRIMMING CHECKLIST"
        departmentColor="bg-blue-700"
        instructions="Complete each step in order. All items must be checked before proceeding to production."
        items={LAMINATION_CHECKLIST_ITEMS}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 