/**
 * Individual Workflow API Routes
 * Handles operations for single workflow templates
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ApiError } from '@/lib/api-response'
import { getServerSession } from 'next-auth'

// Validation schema for workflow tasks
const workflowTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  scheduled_start_time: z.string().optional(),
  scheduled_start_date: z.string().optional(),
  scheduled_end_time: z.string().optional(),
  scheduled_end_date: z.string().optional(),
  priority: z.string().optional(),
})

// Validation schema for updating workflows
const workflowUpdateSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').optional(),
  description: z.string().optional(),
  tasks: z.array(workflowTaskSchema).optional(),
})

/**
 * GET /api/workflows/[workflowId]
 * Get a single workflow template by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const workflowId = parseInt(params.workflowId)
    if (isNaN(workflowId)) {
      throw new ApiError('INVALID_ID', 'Invalid workflow ID')
    }

    const workflow = await prisma.workflow.findUnique({
      where: { workflow_id: workflowId },
      include: {
        WorkflowTask: true,
      },
    })

    if (!workflow) {
      throw new ApiError('NOT_FOUND', 'Workflow not found')
    }

    return Response.json(successResponse(workflow))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * PATCH /api/workflows/[workflowId]
 * Update a single workflow template
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const workflowId = parseInt(params.workflowId)
    if (isNaN(workflowId)) {
      throw new ApiError('INVALID_ID', 'Invalid workflow ID')
    }

    const body = await req.json()
    const validatedData = workflowUpdateSchema.parse(body)

    const updateData: any = {
      name: validatedData.name,
      description: validatedData.description,
    }

    if (validatedData.tasks) {
      updateData.WorkflowTask = {
        deleteMany: {},
        create: validatedData.tasks.map((task) => ({
          ...task,
          scheduled_start_time: task.scheduled_start_time
            ? new Date(task.scheduled_start_time)
            : null,
          scheduled_start_date: task.scheduled_start_date
            ? new Date(task.scheduled_start_date)
            : null,
          scheduled_end_time: task.scheduled_end_time
            ? new Date(task.scheduled_end_time)
            : null,
          scheduled_end_date: task.scheduled_end_date
            ? new Date(task.scheduled_end_date)
            : null,
        })),
      }
    }

    const workflow = await prisma.workflow.update({
      where: { workflow_id: workflowId },
      data: updateData,
      include: {
        WorkflowTask: true,
      },
    })

    return Response.json(successResponse(workflow))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        errorResponse(
          new ApiError('VALIDATION_ERROR', 'Invalid workflow data', error.errors)
        ),
        { status: 400 }
      )
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * DELETE /api/workflows/[workflowId]
 * Delete a single workflow template
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const workflowId = parseInt(params.workflowId)
    if (isNaN(workflowId)) {
      throw new ApiError('INVALID_ID', 'Invalid workflow ID')
    }

    await prisma.workflow.delete({
      where: { workflow_id: workflowId },
    })

    return Response.json(successResponse({ message: 'Workflow deleted successfully' }))
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') {
      return Response.json(errorResponse(error), { status: 404 })
    }
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
} 