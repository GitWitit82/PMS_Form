/**
 * Task Dependencies API Route
 * Handles CRUD operations for task dependencies
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/task-dependencies
 * Retrieves all task dependencies for a given task
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return new NextResponse('Task ID is required', { status: 400 })
    }

    const dependencies = await prisma.taskDependency.findMany({
      where: {
        task_id: parseInt(taskId),
      },
      include: {
        task: true,
        dependent_task: true,
      },
    })

    return NextResponse.json(dependencies)
  } catch (error) {
    console.error('Error fetching task dependencies:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * POST /api/task-dependencies
 * Creates a new task dependency
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { task_id, dependent_task_id, dependency_type, lag_time } = body

    if (!task_id || !dependent_task_id || !dependency_type) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check for circular dependencies
    const existingDependency = await prisma.taskDependency.findFirst({
      where: {
        task_id: dependent_task_id,
        dependent_task_id: task_id,
      },
    })

    if (existingDependency) {
      return new NextResponse('Circular dependency detected', { status: 400 })
    }

    const dependency = await prisma.taskDependency.create({
      data: {
        task_id,
        dependent_task_id,
        dependency_type,
        lag_time: lag_time || 0,
      },
      include: {
        task: true,
        dependent_task: true,
      },
    })

    return NextResponse.json(dependency)
  } catch (error) {
    console.error('Error creating task dependency:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * PATCH /api/task-dependencies/[id]
 * Updates an existing task dependency
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { dependent_task_id, dependency_type, lag_time } = body

    if (!params.id) {
      return new NextResponse('Dependency ID is required', { status: 400 })
    }

    // Check for circular dependencies if updating dependent task
    if (dependent_task_id) {
      const dependency = await prisma.taskDependency.findUnique({
        where: { dependency_id: parseInt(params.id) },
      })

      if (!dependency) {
        return new NextResponse('Dependency not found', { status: 404 })
      }

      const existingDependency = await prisma.taskDependency.findFirst({
        where: {
          task_id: dependent_task_id,
          dependent_task_id: dependency.task_id,
        },
      })

      if (existingDependency) {
        return new NextResponse('Circular dependency detected', { status: 400 })
      }
    }

    const updatedDependency = await prisma.taskDependency.update({
      where: {
        dependency_id: parseInt(params.id),
      },
      data: {
        dependent_task_id,
        dependency_type,
        lag_time,
      },
      include: {
        task: true,
        dependent_task: true,
      },
    })

    return NextResponse.json(updatedDependency)
  } catch (error) {
    console.error('Error updating task dependency:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * DELETE /api/task-dependencies/[id]
 * Deletes a task dependency
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.id) {
      return new NextResponse('Dependency ID is required', { status: 400 })
    }

    await prisma.taskDependency.delete({
      where: {
        dependency_id: parseInt(params.id),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting task dependency:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 