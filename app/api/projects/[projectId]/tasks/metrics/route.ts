import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { subDays, startOfDay, endOfDay } from 'date-fns'

/**
 * GET /api/projects/[projectId]/tasks/metrics
 * Retrieve metrics and analytics for tasks in a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    // Get basic task metrics
    const tasks = await prisma.task.findMany({
      where: {
        project_id: parseInt(params.projectId),
      },
      select: {
        task_id: true,
        status: true,
        priority: true,
        actual_start_date: true,
        actual_end_date: true,
        delay_status: true,
        delay_duration: true,
      },
    })

    // Calculate metrics
    const metrics = {
      total_tasks: tasks.length,
      completed_tasks: tasks.filter(
        (task) => task.status === 'Completed'
      ).length,
      in_progress_tasks: tasks.filter(
        (task) => task.status === 'In Progress'
      ).length,
      delayed_tasks: tasks.filter(
        (task) =>
          task.delay_status === 'Delayed' ||
          task.delay_status === 'Severely Delayed'
      ).length,
      on_hold_tasks: tasks.filter((task) => task.status === 'On Hold')
        .length,
      cancelled_tasks: tasks.filter(
        (task) => task.status === 'Cancelled'
      ).length,
      average_completion_time: calculateAverageCompletionTime(tasks),
      average_delay_duration: calculateAverageDelayDuration(tasks),
    }

    // Calculate trends (last 30 days)
    const trends = await calculateTrends(parseInt(params.projectId))

    // Calculate priority distribution
    const priorities = calculatePriorityDistribution(tasks)

    return successResponse({
      metrics,
      trends,
      priorities,
    })
  } catch (error) {
    console.error('Error retrieving task metrics:', error)
    return errorResponse('Error retrieving task metrics')
  }
}

/**
 * Calculate the average time to complete tasks (in hours)
 */
function calculateAverageCompletionTime(
  tasks: Array<{
    actual_start_date: Date | null
    actual_end_date: Date | null
  }>
): number {
  const completedTasks = tasks.filter(
    (task) => task.actual_start_date && task.actual_end_date
  )

  if (completedTasks.length === 0) return 0

  const totalHours = completedTasks.reduce((sum, task) => {
    const startDate = new Date(task.actual_start_date!)
    const endDate = new Date(task.actual_end_date!)
    const hours =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    return sum + hours
  }, 0)

  return Math.round(totalHours / completedTasks.length)
}

/**
 * Calculate the average delay duration (in hours)
 */
function calculateAverageDelayDuration(
  tasks: Array<{
    delay_duration: string | null
  }>
): number {
  const delayedTasks = tasks.filter((task) => task.delay_duration)

  if (delayedTasks.length === 0) return 0

  const totalHours = delayedTasks.reduce((sum, task) => {
    const duration = task.delay_duration!
    const hours = parseDelayDuration(duration)
    return sum + hours
  }, 0)

  return Math.round(totalHours / delayedTasks.length)
}

/**
 * Parse delay duration string to hours
 */
function parseDelayDuration(duration: string): number {
  const days = duration.match(/(\d+)d/)?.[1]
    ? parseInt(duration.match(/(\d+)d/)![1])
    : 0
  const hours = duration.match(/(\d+)h/)?.[1]
    ? parseInt(duration.match(/(\d+)h/)![1])
    : 0

  return days * 24 + hours
}

/**
 * Calculate task trends over the last 30 days
 */
async function calculateTrends(projectId: number) {
  const trends = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i)
    const start = startOfDay(date)
    const end = endOfDay(date)

    const dailyStats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        project_id: projectId,
        OR: [
          {
            actual_start_date: {
              gte: start,
              lte: end,
            },
          },
          {
            actual_end_date: {
              gte: start,
              lte: end,
            },
          },
          {
            AND: [
              {
                actual_start_date: {
                  lte: end,
                },
              },
              {
                actual_end_date: {
                  gte: start,
                },
              },
            ],
          },
        ],
      },
      _count: true,
    })

    trends.push({
      date: date.toISOString().split('T')[0],
      completed: dailyStats.find((stat) => stat.status === 'Completed')
        ?._count ?? 0,
      in_progress: dailyStats.find(
        (stat) => stat.status === 'In Progress'
      )?._count ?? 0,
      delayed: dailyStats.filter((stat) =>
        ['Delayed', 'Severely Delayed'].includes(stat.status)
      ).reduce((sum, stat) => sum + stat._count, 0),
    })
  }

  return trends
}

/**
 * Calculate priority distribution
 */
function calculatePriorityDistribution(
  tasks: Array<{
    priority: string
  }>
) {
  const distribution = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return Object.entries(distribution).map(([priority, count]) => ({
    priority,
    count,
  }))
} 