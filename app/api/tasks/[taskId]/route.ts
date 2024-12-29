/**
 * Individual Task API Routes
 * Handles operations for single tasks
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'

// Validation schema for updating tasks
const taskUpdateSchema = z.object({
  project_id: z.number().optional(),
  resource_id: z.number().optional(),
  department_id: z.number().optional(),
  name: z.string().min(1, 'Task name is required').optional(),
  description: z.string().optional(),
  scheduled_start_time: z.string().optional(),
  scheduled_start_date: z.string().optional(),
  scheduled_end_time: z.string().optional(),
  scheduled_end_date: z.string().optional(),
  actual_start_time: z.string().optional(),
  actual_start_date: z.string().optional(),
  actual_end_time: z.string().optional(),
  actual_end_date: z.string().optional(),
  delay_duration: z.string().optional(),
  delay_reason: z.string().optional(),
  delay_status: z.string().optional(),
  completion_status: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
})

/**
 * GET /api/tasks/[taskId]
 * Get a single task by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const taskId = parseInt(params.taskId)
    if (isNaN(taskId)) {
      throw new ApiError('INVALID_ID', 'Invalid task ID')
    }

    const task = await prisma.task.findUnique({
      where: { task_id: taskId },
      include: {
        Project: true,
        Resource: true,
        Department: true,
      },
    })

    if (!task) {
      throw new ApiError('NOT_FOUND', 'Task not found')
    }

    return Response.json(successResponse(task))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PATCH /api/tasks/[taskId]
 * Update a single task
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const taskId = parseInt(params.taskId)
    if (isNaN(taskId)) {
      throw new ApiError('INVALID_ID', 'Invalid task ID')
    }

    const body = await req.json()
    const validatedData = taskUpdateSchema.parse(body)

    // Convert date strings to Date objects
    const dateFields = [
      'scheduled_start_time',
      'scheduled_start_date',
      'scheduled_end_time',
      'scheduled_end_date',
      'actual_start_time',
      'actual_start_date',
      'actual_end_time',
      'actual_end_date',
    ]

    const data: any = { ...validatedData }
    dateFields.forEach((field) => {
      if (data[field]) {
        data[field] = new Date(data[field])
      }
    })

    const task = await prisma.task.update({
      where: { task_id: taskId },
      data,
      include: {
        Project: true,
        Resource: true,
        Department: true,
      },
    })

    return Response.json(successResponse(task))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(new ApiError('VALIDATION_ERROR', 'Invalid task data', error.errors)),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * DELETE /api/tasks/[taskId]
 * Delete a single task
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const taskId = parseInt(params.taskId)
    if (isNaN(taskId)) {
      throw new ApiError('INVALID_ID', 'Invalid task ID')
    }

    await prisma.task.delete({
      where: { task_id: taskId },
    })

    return Response.json(successResponse({ message: 'Task deleted successfully' }))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 