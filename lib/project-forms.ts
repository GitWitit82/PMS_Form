import { prisma } from '@/lib/prisma'

interface DefaultForm {
  title: string
  type: string
  department_id: number
  description?: string
  instructions?: string
  fields: any[]
}

export async function createProjectForms(projectId: number) {
  try {
    // Get default forms from the database
    const defaultForms = await prisma.form.findMany({
      where: {
        type: {
          in: ['PROJECT_CHECKLIST', 'QUALITY_CONTROL', 'CUSTOMER_APPROVAL']
        }
      },
      include: {
        templates: {
          where: {
            is_active: true
          },
          take: 1
        }
      }
    })

    // Create form submissions for each default form
    const formSubmissions = await Promise.all(
      defaultForms.map(async (form) => {
        if (form.templates.length === 0) return null

        return prisma.formSubmission.create({
          data: {
            form_id: form.form_id,
            template_id: form.templates[0].template_id,
            project_id: projectId,
            submitted_by: 1, // Default to admin user
            status: 'draft',
            data: {} // Empty data object to be filled later
          }
        })
      })
    )

    return formSubmissions.filter(Boolean)
  } catch (error) {
    console.error('Error creating project forms:', error)
    throw error
  }
}

// Default forms data for seeding
export const defaultProjectForms: DefaultForm[] = [
  {
    title: 'Project Checklist',
    type: 'PROJECT_CHECKLIST',
    department_id: 1,
    description: 'Standard project checklist',
    fields: [
      {
        type: 'checkbox',
        label: 'Initial Contact Complete',
        required: true
      },
      {
        type: 'checkbox',
        label: 'Requirements Gathered',
        required: true
      },
      // Add more default fields
    ]
  },
  {
    title: 'Quality Control Form',
    type: 'QUALITY_CONTROL',
    department_id: 1,
    description: 'Quality control checklist',
    fields: [
      {
        type: 'checkbox',
        label: 'Design Review Complete',
        required: true
      },
      {
        type: 'checkbox',
        label: 'Technical Review Complete',
        required: true
      },
      // Add more QC fields
    ]
  },
  {
    title: 'Customer Approval Form',
    type: 'CUSTOMER_APPROVAL',
    department_id: 1,
    description: 'Customer sign-off form',
    fields: [
      {
        type: 'signature',
        label: 'Customer Signature',
        required: true
      },
      {
        type: 'date',
        label: 'Approval Date',
        required: true
      },
      // Add more approval fields
    ]
  }
] 