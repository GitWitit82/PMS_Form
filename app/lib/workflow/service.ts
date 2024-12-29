/**
 * Workflow service implementation
 */

import { PrismaClient, Workflow, WorkflowStep, WorkflowInstance, Prisma } from '@prisma/client'
import { WorkflowEngine } from './engine'
import { createStepHandlers } from './handlers'
import { DefaultConditionEvaluator, DefaultActionExecutor } from './evaluators'
import { WorkflowStepConfig, TransitionRuleConfig } from './types'

/**
 * Service for managing workflows
 */
export class WorkflowService {
  private prisma: PrismaClient
  private engine: WorkflowEngine

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.engine = new WorkflowEngine(
      prisma,
      createStepHandlers(),
      new DefaultConditionEvaluator(),
      new DefaultActionExecutor()
    )
  }

  /**
   * Creates a new workflow
   */
  async createWorkflow(
    data: {
      name: string
      description?: string
      isTemplate?: boolean
      userId: number
    }
  ): Promise<Workflow> {
    return this.prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        is_template: data.isTemplate ?? false,
        status: 'DRAFT',
        version: 1,
        created_by: data.userId,
        updated_by: data.userId
      }
    })
  }

  /**
   * Updates an existing workflow
   */
  async updateWorkflow(
    workflowId: number,
    data: {
      name?: string
      description?: string
      status?: string
      userId: number
    }
  ): Promise<Workflow> {
    return this.prisma.workflow.update({
      where: { workflow_id: workflowId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        updated_by: data.userId,
        updated_at: new Date()
      }
    })
  }

  /**
   * Adds a step to a workflow
   */
  async addWorkflowStep(
    workflowId: number,
    data: {
      name: string
      description?: string
      stepType: string
      order: number
      config: WorkflowStepConfig
    }
  ): Promise<WorkflowStep> {
    return this.prisma.workflowStep.create({
      data: {
        workflow_id: workflowId,
        name: data.name,
        description: data.description,
        step_type: data.stepType as any,
        order: data.order,
        config: data.config as any
      }
    })
  }

  /**
   * Adds a transition rule between steps
   */
  async addTransitionRule(
    data: {
      fromStepId: number
      toStepId: number
      name: string
      description?: string
      type: string
      conditions?: TransitionRuleConfig['conditions']
      config?: Record<string, any>
    }
  ): Promise<any> {
    return this.prisma.transitionRule.create({
      data: {
        from_step_id: data.fromStepId,
        to_step_id: data.toStepId,
        name: data.name,
        description: data.description,
        type: data.type as any,
        conditions: data.conditions as any,
        config: data.config as any
      }
    })
  }

  /**
   * Starts a workflow instance
   */
  async startWorkflow(
    workflowId: number,
    input: Record<string, any>,
    userId: number
  ): Promise<WorkflowInstance> {
    return this.engine.startWorkflow(workflowId, input, userId)
  }

  /**
   * Gets a workflow instance by ID
   */
  async getWorkflowInstance(instanceId: number): Promise<WorkflowInstance & {
    workflow: Workflow
    step_instances: any[]
  }> {
    return this.prisma.workflowInstance.findUnique({
      where: { instance_id: instanceId },
      include: {
        workflow: true,
        step_instances: {
          include: {
            step: true
          }
        }
      }
    })
  }

  /**
   * Lists workflow instances with filtering and pagination
   */
  async listWorkflowInstances(params: {
    workflowId?: number
    status?: string
    createdBy?: number
    skip?: number
    take?: number
  }): Promise<{
    items: WorkflowInstance[]
    total: number
  }> {
    const where: Prisma.WorkflowInstanceWhereInput = {}
    
    if (params.workflowId) where.workflow_id = params.workflowId
    if (params.status) where.status = params.status
    if (params.createdBy) where.created_by = params.createdBy

    const [items, total] = await Promise.all([
      this.prisma.workflowInstance.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { started_at: 'desc' },
        include: {
          workflow: true,
          step_instances: {
            include: {
              step: true
            }
          }
        }
      }),
      this.prisma.workflowInstance.count({ where })
    ])

    return { items, total }
  }

  /**
   * Updates the state of a workflow instance
   */
  async updateWorkflowState(
    instanceId: number,
    updates: Record<string, any>
  ): Promise<WorkflowInstance> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { instance_id: instanceId }
    })

    if (!instance) {
      throw new Error(`Workflow instance ${instanceId} not found`)
    }

    const context = instance.context as any
    context.state = { ...context.state, ...updates }

    return this.prisma.workflowInstance.update({
      where: { instance_id: instanceId },
      data: {
        context: context as any
      }
    })
  }
} 