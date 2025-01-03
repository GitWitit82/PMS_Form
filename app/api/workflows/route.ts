/**
 * Workflow API Routes
 * Handles CRUD operations for workflows
 */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'

// GET /api/workflows
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const workflows = await prisma.workflow.findMany({
      include: {
        workflowTasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

// POST /api/workflows
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { name, description, tasks } = data

    const workflow = await prisma.workflow.create({
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
      action: 'create',
      entityType: 'workflow',
      entityId: workflow.workflow_id,
      details: { workflow },
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error in POST /api/workflows:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 