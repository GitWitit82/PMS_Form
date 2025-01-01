/**
 * Project Detail API Route
 * Handles operations for individual projects
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    projectId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!params?.projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  try {
    const projectId = parseInt(params.projectId)
    const project = await prisma.project.findUnique({
      where: { project_id: projectId },
      include: {
        Customer: true,
        tasks: {
          orderBy: {
            created_at: 'desc',
          },
        },
        forms: {
          include: {
            form: true,
            template: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!params?.projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  try {
    const projectId = parseInt(params.projectId)
    const data = await request.json()

    const project = await prisma.project.update({
      where: { project_id: projectId },
      data: {
        name: data.name,
        description: data.description,
        customer_id: parseInt(data.customer_id),
        status: data.status,
        vin_number: data.vin_number,
        invoice_number: data.invoice_number,
      },
      include: {
        Customer: true,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!params?.projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  try {
    const projectId = parseInt(params.projectId)
    await prisma.project.delete({
      where: { project_id: projectId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 