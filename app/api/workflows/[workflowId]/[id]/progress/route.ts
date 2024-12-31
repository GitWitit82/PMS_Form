/**
 * Workflow Progress API Route
 * Handles fetching and updating workflow progress
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/workflows/[workflowId]/progress
 * Retrieves workflow progress including task completion and dependencies
 */
export async function GET(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.workflowId) {
      return new NextResponse('Workflow ID is required', { status: 400 })
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        workflow_id: parseInt(params.workflowId),
      },
      include: {
        tasks: {
          include: {
            dependencies: {
              include: {
                dependent_task: true,
              },
            },
          },
        },
      },
    })

    if (!workflow) {
      return new NextResponse('Workflow not found', { status: 404 })
    }

    const totalTasks = workflow.tasks.length
    const completedTasks = workflow.tasks.filter(
      (task) => task.status === 'completed'
    ).length
    const inProgressTasks = workflow.tasks.filter(
      (task) => task.status === 'in-progress'
    ).length
    const blockedTasks = workflow.tasks.filter(
      (task) => task.status === 'blocked'
    ).length

    const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Calculate estimated completion based on task durations and dependencies
    let estimatedCompletion = null
    if (workflow.start_date && totalTasks > 0) {
      const remainingTasks = workflow.tasks.filter(
        (task) => task.status !== 'completed'
      )
      if (remainingTasks.length > 0) {
        const maxEndDate = remainingTasks.reduce((latest, task) => {
          const taskDuration = task.estimated_duration || 0
          const dependencies = task.dependencies || []
          const dependencyEndDates = dependencies.map((dep) => {
            const dependentTask = workflow.tasks.find(
              (t) => t.workflow_task_id === dep.dependent_task.workflow_task_id
            )
            return dependentTask?.end_date || new Date()
          })
          const latestDependencyEnd = dependencyEndDates.length
            ? new Date(Math.max(...dependencyEndDates.map((d) => d.getTime())))
            : new Date()
          const taskEnd = new Date(latestDependencyEnd)
          taskEnd.setMinutes(taskEnd.getMinutes() + taskDuration)
          return taskEnd > latest ? taskEnd : latest
        }, new Date())
        estimatedCompletion = maxEndDate
      }
    }

    const progress = {
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      blocked_tasks: blockedTasks,
      overall_progress: overallProgress,
      estimated_completion: estimatedCompletion,
      tasks: workflow.tasks.map((task) => ({
        workflow_task_id: task.workflow_task_id,
        name: task.name,
        status: task.status,
        start_date: task.start_date,
        end_date: task.end_date,
        dependencies: task.dependencies,
      })),
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching workflow progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

/**
 * PATCH /api/workflows/[workflowId]/progress
 * Updates workflow progress and task statuses
 */
export async function PATCH(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.workflowId) {
      return new NextResponse('Workflow ID is required', { status: 400 })
    }

    const body = await request.json()
    const { task_id, status } = body

    if (!task_id || !status) {
      return new NextResponse('Task ID and status are required', { status: 400 })
    }

    // Check if task exists and belongs to the workflow
    const task = await prisma.workflowTask.findFirst({
      where: {
        workflow_task_id: task_id,
        workflow_id: parseInt(params.workflowId),
      },
      include: {
        dependencies: {
          include: {
            dependent_task: true,
          },
        },
      },
    })

    if (!task) {
      return new NextResponse('Task not found', { status: 404 })
    }

    // Check if task can be updated based on dependencies
    if (status === 'in-progress' || status === 'completed') {
      const canUpdate = task.dependencies.every((dep) => {
        switch (dep.dependency_type) {
          case 'finish-to-start':
            return dep.dependent_task.status === 'completed'
          case 'start-to-start':
            return (
              dep.dependent_task.status === 'in-progress' ||
              dep.dependent_task.status === 'completed'
            )
          case 'finish-to-finish':
            return status !== 'completed' || dep.dependent_task.status === 'completed'
          case 'start-to-finish':
            return (
              dep.dependent_task.status === 'in-progress' ||
              dep.dependent_task.status === 'completed'
            )
          default:
            return false
        }
      })

      if (!canUpdate) {
        return new NextResponse('Task dependencies not met', { status: 400 })
      }
    }

    // Update task status and dates
    const now = new Date()
    const updatedTask = await prisma.workflowTask.update({
      where: {
        workflow_task_id: task_id,
      },
      data: {
        status,
        start_date: status === 'in-progress' ? now : task.start_date,
        end_date: status === 'completed' ? now : null,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating workflow progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 