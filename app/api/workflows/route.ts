/**
 * Workflows API Routes
 * Handles CRUD operations for workflow templates
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

// Validation schema for creating/updating workflows
const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  tasks: z.array(workflowTaskSchema),
})

/**
 * GET /api/workflows
 * Get all workflow templates
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const workflows = await prisma.workflow.findMany({
      include: {
        WorkflowTask: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return Response.json(successResponse(workflows))
  } catch (error) {
    return Response.json(errorResponse(error as Error), { status: 500 })
  }
}

/**
 * POST /api/workflows
 * Create a new workflow template
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const validatedData = workflowSchema.parse(body)

    const workflow = await prisma.workflow.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        WorkflowTask: {
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
        },
      },
      include: {
        WorkflowTask: true,
      },
    })

    return Response.json(successResponse(workflow), { status: 201 })
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
 * PUT /api/workflows
 * Bulk update workflow templates
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      throw new ApiError('UNAUTHORIZED', 'You must be logged in to access this resource')
    }

    const body = await req.json()
    const { workflows } = body

    if (!Array.isArray(workflows)) {
      throw new ApiError('VALIDATION_ERROR', 'Workflows must be an array')
    }

    const updatedWorkflows = await Promise.all(
      workflows.map(async (workflow) => {
        const validatedData = workflowSchema.parse(workflow)

        return prisma.workflow.update({
          where: { workflow_id: workflow.workflow_id },
          data: {
            name: validatedData.name,
            description: validatedData.description,
            WorkflowTask: {
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
            },
          },
          include: {
            WorkflowTask: true,
          },
        })
      })
    )

    return Response.json(successResponse(updatedWorkflows))
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