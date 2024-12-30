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
      where: {
        form_id: formId
      },
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
      department: {
        name: form.department.name,
        color: form.department.color,
        department_id: form.department.department_id
      },
      templates: form.templates.map(template => ({
        template_id: template.template_id,
        name: template.name,
        fields: template.fields,
        layout: template.layout
      }))
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

    const body = await request.json()
    const { title, description, instructions, department_id, fields } = body

    // Update the form
    const updatedForm = await prisma.form.update({
      where: {
        form_id: formId
      },
      data: {
        title,
        description,
        instructions,
        department_id,
      }
    })

    // Create a new template version
    const newTemplate = await prisma.formTemplate.create({
      data: {
        form_id: formId,
        name: `${title} Template`,
        description: `Template for ${title}`,
        fields: {
          items: fields.map((field: any) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required || false,
            placeholder: field.placeholder || '',
            options: field.options || []
          }))
        },
        layout: {
          sections: [
            {
              title: 'Tasks',
              description: 'Complete all tasks in order',
              fields: fields.map((field: any) => field.id)
            }
          ]
        },
        version: {
          increment: 1
        },
        is_active: true
      }
    })

    // Deactivate old templates
    await prisma.formTemplate.updateMany({
      where: {
        form_id: formId,
        template_id: {
          not: newTemplate.template_id
        }
      },
      data: {
        is_active: false
      }
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
} 