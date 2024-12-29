/**
 * Workflow Engine Implementation
 */

import { PrismaClient, Workflow, WorkflowStep, WorkflowInstance, WorkflowStepInstance } from '@prisma/client'
import {
  WorkflowContext,
  StepHandler,
  ConditionEvaluator,
  ActionExecutor,
  StepExecutionResult,
  TransitionRuleConfig
} from './types'

/**
 * Main workflow engine class responsible for workflow execution and management
 */
export class WorkflowEngine {
  private prisma: PrismaClient
  private stepHandlers: Map<string, StepHandler>
  private conditionEvaluator: ConditionEvaluator
  private actionExecutor: ActionExecutor

  /**
   * Creates a new instance of the workflow engine
   */
  constructor(
    prisma: PrismaClient,
    stepHandlers: Map<string, StepHandler>,
    conditionEvaluator: ConditionEvaluator,
    actionExecutor: ActionExecutor
  ) {
    this.prisma = prisma
    this.stepHandlers = stepHandlers
    this.conditionEvaluator = conditionEvaluator
    this.actionExecutor = actionExecutor
  }

  /**
   * Starts a new workflow instance
   */
  async startWorkflow(
    workflowId: number,
    input: Record<string, any>,
    userId: number
  ): Promise<WorkflowInstance> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { workflow_id: workflowId },
      include: { steps: { orderBy: { order: 'asc' } } }
    })

    if (!workflow) {
      throw new Error(`Workflow with ID ${workflowId} not found`)
    }

    if (workflow.status !== 'ACTIVE') {
      throw new Error(`Workflow ${workflowId} is not active`)
    }

    const firstStep = workflow.steps[0]
    if (!firstStep) {
      throw new Error(`Workflow ${workflowId} has no steps`)
    }

    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflow_id: workflowId,
        status: 'RUNNING',
        context: {
          input,
          state: {},
          output: {},
          metadata: {
            startedAt: new Date(),
            lastUpdatedAt: new Date(),
            currentStepId: firstStep.step_id,
            status: 'RUNNING'
          }
        },
        created_by: userId,
        step_instances: {
          create: {
            step_id: firstStep.step_id,
            status: 'PENDING'
          }
        }
      }
    })

    // Start execution
    this.executeStep(instance.instance_id, firstStep).catch(error => {
      console.error(`Error executing workflow ${workflowId}:`, error)
      this.handleWorkflowError(instance.instance_id, error)
    })

    return instance
  }

  /**
   * Executes a specific step in the workflow
   */
  private async executeStep(
    instanceId: number,
    step: WorkflowStep
  ): Promise<void> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { instance_id: instanceId }
    })

    if (!instance) {
      throw new Error(`Workflow instance ${instanceId} not found`)
    }

    const context = instance.context as WorkflowContext
    const handler = this.stepHandlers.get(step.step_type)

    if (!handler) {
      throw new Error(`No handler found for step type ${step.step_type}`)
    }

    try {
      // Update step instance status
      await this.prisma.workflowStepInstance.update({
        where: {
          instance_id: instanceId,
          step_id: step.step_id
        },
        data: {
          status: 'RUNNING',
          started_at: new Date()
        }
      })

      // Execute the step
      const result = await handler.execute(step, context)

      if (result.success) {
        await this.handleStepSuccess(instanceId, step, result)
      } else {
        await this.handleStepFailure(instanceId, step, result.error || 'Step execution failed')
      }
    } catch (error) {
      await this.handleStepFailure(instanceId, step, error.message)
    }
  }

  /**
   * Handles successful step execution
   */
  private async handleStepSuccess(
    instanceId: number,
    step: WorkflowStep,
    result: StepExecutionResult
  ): Promise<void> {
    // Update step instance
    await this.prisma.workflowStepInstance.update({
      where: {
        instance_id: instanceId,
        step_id: step.step_id
      },
      data: {
        status: 'COMPLETED',
        completed_at: new Date(),
        result: result.output || {}
      }
    })

    // Find next step
    if (result.nextStepId) {
      const nextStep = await this.prisma.workflowStep.findUnique({
        where: { step_id: result.nextStepId }
      })

      if (nextStep) {
        // Create next step instance
        await this.prisma.workflowStepInstance.create({
          data: {
            workflow_instance_id: instanceId,
            step_id: nextStep.step_id,
            status: 'PENDING'
          }
        })

        // Continue workflow execution
        await this.executeStep(instanceId, nextStep)
      }
    } else {
      // No next step, workflow is complete
      await this.completeWorkflow(instanceId)
    }
  }

  /**
   * Handles step execution failure
   */
  private async handleStepFailure(
    instanceId: number,
    step: WorkflowStep,
    error: string
  ): Promise<void> {
    await this.prisma.workflowStepInstance.update({
      where: {
        instance_id: instanceId,
        step_id: step.step_id
      },
      data: {
        status: 'FAILED',
        completed_at: new Date(),
        result: { error }
      }
    })

    await this.handleWorkflowError(instanceId, error)
  }

  /**
   * Handles workflow-level errors
   */
  private async handleWorkflowError(
    instanceId: number,
    error: string
  ): Promise<void> {
    await this.prisma.workflowInstance.update({
      where: { instance_id: instanceId },
      data: {
        status: 'FAILED',
        context: {
          update: {
            metadata: {
              status: 'FAILED',
              error,
              lastUpdatedAt: new Date()
            }
          }
        }
      }
    })
  }

  /**
   * Completes a workflow instance
   */
  private async completeWorkflow(instanceId: number): Promise<void> {
    await this.prisma.workflowInstance.update({
      where: { instance_id: instanceId },
      data: {
        status: 'COMPLETED',
        completed_at: new Date(),
        context: {
          update: {
            metadata: {
              status: 'COMPLETED',
              lastUpdatedAt: new Date()
            }
          }
        }
      }
    })
  }
} 