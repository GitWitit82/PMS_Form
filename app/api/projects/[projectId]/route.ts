/**
 * Individual Project API Routes
 * Handles operations for single projects
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  customer_id: z.number().optional(),
  start_date: z.string().datetime().optional().nullable(),
  end_date: z.string().datetime().optional().nullable(),
  status: z.enum(['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled']).optional(),
})

/**
 * GET /api/projects/[projectId]
 * Get a single project by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { projectId } = params
    const id = Number(projectId)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { project_id: id },
      include: {
        Customer: true,
        tasks: {
          include: {
            Resource: true,
            Department: true
          }
        },
        forms: {
          include: {
            form: true,
            template: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error('Error fetching project:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/projects/[projectId]
 * Update a single project
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projectId = Number(params.projectId)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = projectUpdateSchema.parse(body)

    const updateData = {
      ...validatedData,
      start_date: validatedData.start_date
        ? new Date(validatedData.start_date)
        : undefined,
      end_date: validatedData.end_date
        ? new Date(validatedData.end_date)
        : undefined,
    }

    const project = await prisma.project.update({
      where: { project_id: projectId },
      data: updateData,
      include: {
        Customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Task: {
          select: {
            task_id: true,
            name: true,
            status: true,
            Resource: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    return NextResponse.json({ data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/projects/[projectId]
 * Delete a single project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projectId = Number(params.projectId)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    await prisma.project.delete({
      where: { project_id: projectId },
    })

    return NextResponse.json({ 
      data: { message: 'Project deleted successfully' }
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 