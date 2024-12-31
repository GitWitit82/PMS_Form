import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create departments
  const production = await prisma.department.upsert({
    where: { name: 'Production' },
    update: {},
    create: {
      name: 'Production',
      description: 'Production department responsible for vehicle wraps and printing',
      color: '#0891b2' // Cyan color
    }
  })

  const graphicDesign = await prisma.department.upsert({
    where: { name: 'Graphic Design' },
    update: {},
    create: {
      name: 'Graphic Design',
      description: 'Graphic Design department responsible for design and artwork',
      color: '#9333ea' // Purple color
    }
  })

  const prepress = await prisma.department.upsert({
    where: { name: 'Prepress' },
    update: {},
    create: {
      name: 'Prepress',
      description: 'Prepress department responsible for file preparation',
      color: '#0ea5e9' // Sky blue color
    }
  })

  // Create Panel Form
  const panelForm = await prisma.form.upsert({
    where: { form_id: 1 },
    update: {},
    create: {
      title: 'PRINT/PANEL CHECKLIST',
      description: 'Dynamic form for tracking vehicle wrap panel measurements and production status',
      department_id: production.department_id,
      type: 'CHECKLIST',
      instructions: 'Each item MUST be completed prior to sign off. Signature equals financial responsibility for step or any cost required to fix.'
    }
  })

  // Create Graphic Design Checklist
  const graphicDesignForm = await prisma.form.upsert({
    where: { form_id: 2 },
    update: {},
    create: {
      title: 'GRAPHIC DESIGN CHECKLIST',
      description: 'Checklist for graphic design tasks and approvals',
      department_id: graphicDesign.department_id,
      type: 'CHECKLIST',
      instructions: 'Complete all items before submitting for client approval'
    }
  })

  // Create Paneling Prepress Checklist
  const prepassForm = await prisma.form.upsert({
    where: { form_id: 3 },
    update: {},
    create: {
      title: 'PANELING PREPRESS CHECKLIST',
      description: 'Checklist for prepress tasks and file preparation',
      department_id: prepress.department_id,
      type: 'CHECKLIST',
      instructions: 'Verify all items before sending to production'
    }
  })

  // Create Print Checklist
  const printForm = await prisma.form.upsert({
    where: { form_id: 4 },
    update: {},
    create: {
      title: 'PRINT CHECKLIST',
      description: 'Checklist for print quality control and verification',
      department_id: production.department_id,
      type: 'CHECKLIST',
      instructions: 'Check all print quality aspects before proceeding'
    }
  })

  // Create Lamination & Trimming Checklist
  const laminationForm = await prisma.form.upsert({
    where: { form_id: 5 },
    update: {},
    create: {
      title: 'LAMINATION & TRIMMING CHECKLIST',
      description: 'Checklist for lamination and trimming tasks',
      department_id: production.department_id,
      type: 'CHECKLIST',
      instructions: 'Verify all items before final trimming'
    }
  })

  // Create Plotting Tasks Checklist
  const plottingForm = await prisma.form.upsert({
    where: { form_id: 6 },
    update: {},
    create: {
      title: 'PLOTTING TASKS CHECKLIST',
      description: 'Checklist for plotting and cutting tasks',
      department_id: production.department_id,
      type: 'CHECKLIST',
      instructions: 'Complete all plotting verifications'
    }
  })

  // Create Panel Form Template
  await prisma.formTemplate.upsert({
    where: { template_id: 1 },
    update: {},
    create: {
      form_id: panelForm.form_id,
      name: 'Panel Form Template',
      description: 'Template for vehicle wrap panel measurements',
      version: 1,
      is_active: true,
      fields: {
        sections: [
          'DRIVER_SIDE',
          'PASSENGER_SIDE',
          'BACK_SIDE',
          'FRONT_SIDE',
          'TOP',
          'PRINT_CUTS',
          'PERF'
        ],
        rowFields: [
          { name: 'height', type: 'text', label: 'Height' },
          { name: 'width', type: 'text', label: 'Width' },
          { name: 'qty', type: 'text', label: 'Quantity' },
          { name: 'confirmSize', type: 'checkbox', label: 'Confirm Size' },
          { name: 'ripPrint', type: 'checkbox', label: 'RIP/Print' },
          { name: 'laminated', type: 'checkbox', label: 'Laminated' },
          { name: 'confirmPrinted', type: 'checkbox', label: 'Confirm Printed' }
        ]
      },
      layout: {
        projectInfo: {
          fields: [
            { name: 'client', type: 'text', label: 'Client' },
            { name: 'project', type: 'text', label: 'Project' },
            { name: 'vinNumber', type: 'text', label: 'VIN Number' },
            { name: 'invoiceNumber', type: 'text', label: 'Invoice#' },
            { name: 'date', type: 'date', label: 'Date' }
          ]
        }
      }
    }
  })

  // Create templates for other forms with checklist items
  const createBasicTemplate = async (formId: number, templateId: number, items: string[]) => {
    await prisma.formTemplate.upsert({
      where: { template_id: templateId },
      update: {},
      create: {
        form_id: formId,
        name: 'Basic Checklist Template',
        description: 'Basic checklist template',
        version: 1,
        is_active: true,
        fields: {
          sections: ['CHECKLIST'],
          rowFields: [
            { name: 'task', type: 'text', label: 'Task' },
            { name: 'completed', type: 'checkbox', label: 'Completed' },
            { name: 'notes', type: 'text', label: 'Notes' }
          ],
          rows: items.map((item, index) => ({
            id: index + 1,
            task: item,
            completed: false,
            notes: ''
          }))
        },
        layout: {
          projectInfo: {
            fields: [
              { name: 'client', type: 'text', label: 'Client' },
              { name: 'project', type: 'text', label: 'Project' },
              { name: 'date', type: 'date', label: 'Date' }
            ]
          }
        }
      }
    })
  }

  // Create templates for each form
  await createBasicTemplate(graphicDesignForm.form_id, 2, [
    'File setup correct',
    'Colors verified',
    'Typography checked',
    'Images high resolution',
    'Client approval received'
  ])

  await createBasicTemplate(prepassForm.form_id, 3, [
    'Files prepared for production',
    'Color profiles checked',
    'Bleed and trim marks added',
    'Resolution verified',
    'Panel layout complete'
  ])

  await createBasicTemplate(printForm.form_id, 4, [
    'Print settings verified',
    'Color calibration checked',
    'Test print approved',
    'Material loaded correctly',
    'Quality inspection complete'
  ])

  await createBasicTemplate(laminationForm.form_id, 5, [
    'Lamination temperature correct',
    'No bubbles or defects',
    'Edges trimmed properly',
    'Surface cleaned',
    'Final inspection complete'
  ])

  await createBasicTemplate(plottingForm.form_id, 6, [
    'Cut lines verified',
    'Material loaded correctly',
    'Test cut completed',
    'Registration marks aligned',
    'Final cuts inspected'
  ])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 