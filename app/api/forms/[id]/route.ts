import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formId = parseInt(params.id)
    if (isNaN(formId)) {
      return NextResponse.json(
        { error: 'Invalid form ID' },
        { status: 400 }
      )
    }

    const form = await prisma.form.findUnique({
      where: { form_id: formId },
      include: {
        department: true,
        templates: {
          where: {
            is_active: true
          },
          orderBy: {
            version: 'desc'
          },
          take: 1
        },
        workflowTasks: {
          select: {
            name: true,
            stage: true
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Transform the response to match the expected interface
    const transformedForm = {
      form_id: form.form_id,
      title: form.title,
      description: form.description || '',
      instructions: form.instructions || '',
      type: form.type,
      department: {
        name: form.department.name,
        color: form.department.color
      },
      templates: form.templates,
      workflowTasks: form.workflowTasks
    }

    return NextResponse.json(transformedForm)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formId = parseInt(params.id)
    if (isNaN(formId)) {
      return NextResponse.json(
        { error: 'Invalid form ID' },
        { status: 400 }
      )
    }

    const data = await request.json()

    // Update form
    const updatedForm = await prisma.form.update({
      where: { form_id: formId },
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        type: data.type,
        department_id: data.department_id
      }
    })

    // Create new template version
    if (data.template) {
      // Deactivate old templates
      await prisma.formTemplate.updateMany({
        where: {
          form_id: formId,
          is_active: true
        },
        data: {
          is_active: false
        }
      })

      // Create new template
      await prisma.formTemplate.create({
        data: {
          form_id: formId,
          name: data.template.name,
          description: data.template.description,
          fields: data.template.fields,
          layout: data.template.layout,
          version: data.template.version,
          is_active: true
        }
      })
    }

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
} 