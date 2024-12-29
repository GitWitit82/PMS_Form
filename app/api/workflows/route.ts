/**
 * Workflow API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WorkflowService } from '@/lib/workflow/service'
import { getCurrentUser } from '@/lib/session'

const workflowService = new WorkflowService(prisma)

/**
 * GET /api/workflows
 * Lists workflows with optional filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')
    const status = searchParams.get('status') || undefined
    const workflowId = searchParams.get('workflowId')
      ? parseInt(searchParams.get('workflowId')!)
      : undefined

    const instances = await workflowService.listWorkflowInstances({
      workflowId,
      status,
      skip,
      take
    })

    return NextResponse.json(instances)
  } catch (error) {
    console.error('Error listing workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows
 * Creates a new workflow
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, isTemplate } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const workflow = await workflowService.createWorkflow({
      name,
      description,
      isTemplate,
      userId: user.user_id
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/workflows/:id
 * Updates an existing workflow
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = parseInt(params.id)
    const body = await req.json()
    const { name, description, status } = body

    const workflow = await workflowService.updateWorkflow(workflowId, {
      name,
      description,
      status,
      userId: user.user_id
    })

    return NextResponse.json(workflow)
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows/:id/steps
 * Adds a step to a workflow
 */
export async function POST_STEP(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = parseInt(params.id)
    const body = await req.json()
    const { name, description, stepType, order, config } = body

    if (!name || !stepType || order === undefined) {
      return NextResponse.json(
        { error: 'Name, stepType, and order are required' },
        { status: 400 }
      )
    }

    const step = await workflowService.addWorkflowStep(workflowId, {
      name,
      description,
      stepType,
      order,
      config
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Error adding workflow step:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows/:id/transitions
 * Adds a transition rule between steps
 */
export async function POST_TRANSITION(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      fromStepId,
      toStepId,
      name,
      description,
      type,
      conditions,
      config
    } = body

    if (!fromStepId || !toStepId || !name || !type) {
      return NextResponse.json(
        { error: 'fromStepId, toStepId, name, and type are required' },
        { status: 400 }
      )
    }

    const transition = await workflowService.addTransitionRule({
      fromStepId,
      toStepId,
      name,
      description,
      type,
      conditions,
      config
    })

    return NextResponse.json(transition)
  } catch (error) {
    console.error('Error adding transition rule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows/:id/start
 * Starts a workflow instance
 */
export async function POST_START(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = parseInt(params.id)
    const body = await req.json()
    const { input } = body

    const instance = await workflowService.startWorkflow(
      workflowId,
      input || {},
      user.user_id
    )

    return NextResponse.json(instance)
  } catch (error) {
    console.error('Error starting workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/workflows/:id/state
 * Updates the state of a workflow instance
 */
export async function PUT_STATE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instanceId = parseInt(params.id)
    const body = await req.json()
    const { updates } = body

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      )
    }

    const instance = await workflowService.updateWorkflowState(
      instanceId,
      updates
    )

    return NextResponse.json(instance)
  } catch (error) {
    console.error('Error updating workflow state:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 