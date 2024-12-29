/**
 * Individual Workflow API Routes
 * Handles operations for specific workflows
 */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

// GET /api/workflows/[workflowId]
export async function GET(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workflowId = parseInt(params.workflowId)
    const workflow = await prisma.workflow.findUnique({
      where: { workflow_id: workflowId },
      include: {
        workflowTasks: true,
      },
    })

    if (!workflow) {
      return new NextResponse('Workflow not found', { status: 404 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error in GET /api/workflows/[workflowId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// PUT /api/workflows/[workflowId]
export async function PUT(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workflowId = parseInt(params.workflowId)
    const data = await request.json()
    const { name, description, tasks } = data

    // Delete existing tasks
    await prisma.workflowTask.deleteMany({
      where: { workflow_id: workflowId },
    })

    // Update workflow and create new tasks
    const workflow = await prisma.workflow.update({
      where: { workflow_id: workflowId },
      data: {
        name,
        description,
        workflowTasks: {
          create: tasks.map((task: any) => ({
            name: task.name,
            description: task.description,
            scheduled_start_date: task.scheduled_start_date ? new Date(task.scheduled_start_date) : null,
            scheduled_end_date: task.scheduled_end_date ? new Date(task.scheduled_end_date) : null,
            scheduled_start_time: task.scheduled_start_time
              ? new Date(`1970-01-01T${task.scheduled_start_time}:00`)
              : null,
            scheduled_end_time: task.scheduled_end_time
              ? new Date(`1970-01-01T${task.scheduled_end_time}:00`)
              : null,
            priority: task.priority,
          })),
        },
      },
      include: {
        workflowTasks: true,
      },
    })

    await logActivity({
      userId: session.user.id,
      type: 'workflow',
      action: 'update',
      entityType: 'workflow',
      entityId: workflow.workflow_id,
      details: { workflow },
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error in PUT /api/workflows/[workflowId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// DELETE /api/workflows/[workflowId]
export async function DELETE(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workflowId = parseInt(params.workflowId)

    // Delete workflow (this will cascade delete tasks)
    const workflow = await prisma.workflow.delete({
      where: { workflow_id: workflowId },
    })

    await logActivity({
      userId: session.user.id,
      type: 'workflow',
      action: 'delete',
      entityType: 'workflow',
      entityId: workflowId,
      details: { workflow },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/workflows/[workflowId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 