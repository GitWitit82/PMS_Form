import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
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
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Transform the response to match the expected interface
    const transformedForms = forms.map(form => ({
      form_id: form.form_id,
      title: form.title,
      description: form.description || '',
      type: form.type,
      department: {
        name: form.department.name,
        color: form.department.color
      },
      workflowTasks: form.workflowTasks
    }))

    return NextResponse.json(transformedForms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
} 