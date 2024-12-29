/**
 * Implementation of workflow step handlers
 */

import { WorkflowStep, WorkflowStepType } from '@prisma/client'
import { StepHandler, WorkflowContext, StepExecutionResult, WorkflowStepConfig } from './types'

/**
 * Base class for step handlers
 */
abstract class BaseStepHandler implements StepHandler {
  abstract execute(step: WorkflowStep, context: WorkflowContext): Promise<StepExecutionResult>

  /**
   * Validates step configuration
   */
  protected validateConfig(config: WorkflowStepConfig): void {
    if (config.inputs) {
      for (const [key, input] of Object.entries(config.inputs)) {
        if (input.required && input.default === undefined) {
          throw new Error(`Required input ${key} has no default value`)
        }
      }
    }
  }

  /**
   * Validates step inputs against configuration
   */
  protected validateInputs(inputs: Record<string, any>, config: WorkflowStepConfig): void {
    if (!config.inputs) return

    for (const [key, input] of Object.entries(config.inputs)) {
      if (input.required && inputs[key] === undefined) {
        throw new Error(`Required input ${key} is missing`)
      }

      if (inputs[key] !== undefined) {
        const value = inputs[key]
        
        // Type validation
        if (typeof value !== input.type && input.type !== 'object') {
          throw new Error(`Input ${key} should be of type ${input.type}`)
        }

        // Custom validation
        if (input.validation) {
          if (input.validation.pattern && typeof value === 'string') {
            const regex = new RegExp(input.validation.pattern)
            if (!regex.test(value)) {
              throw new Error(`Input ${key} does not match pattern ${input.validation.pattern}`)
            }
          }

          if (input.validation.min !== undefined && typeof value === 'number') {
            if (value < input.validation.min) {
              throw new Error(`Input ${key} should be >= ${input.validation.min}`)
            }
          }

          if (input.validation.max !== undefined && typeof value === 'number') {
            if (value > input.validation.max) {
              throw new Error(`Input ${key} should be <= ${input.validation.max}`)
            }
          }
        }
      }
    }
  }
}

/**
 * Handler for task type steps
 */
export class TaskStepHandler extends BaseStepHandler {
  async execute(step: WorkflowStep, context: WorkflowContext): Promise<StepExecutionResult> {
    const config = step.config as WorkflowStepConfig
    
    try {
      this.validateConfig(config)
      this.validateInputs(context.input, config)

      // Execute task logic here
      // This is where you would implement the actual task execution
      
      return {
        success: true,
        output: {
          // Task output here
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Handler for approval type steps
 */
export class ApprovalStepHandler extends BaseStepHandler {
  async execute(step: WorkflowStep, context: WorkflowContext): Promise<StepExecutionResult> {
    const config = step.config as WorkflowStepConfig
    
    try {
      this.validateConfig(config)
      this.validateInputs(context.input, config)

      // Check if approval has been granted
      const isApproved = context.state.approved === true

      if (isApproved) {
        return {
          success: true,
          output: {
            approved: true,
            approvedAt: new Date(),
            approvedBy: context.state.approvedBy
          }
        }
      } else {
        return {
          success: false,
          error: 'Approval pending'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Handler for notification type steps
 */
export class NotificationStepHandler extends BaseStepHandler {
  async execute(step: WorkflowStep, context: WorkflowContext): Promise<StepExecutionResult> {
    const config = step.config as WorkflowStepConfig
    
    try {
      this.validateConfig(config)
      this.validateInputs(context.input, config)

      // Send notification logic here
      // This is where you would implement the actual notification sending
      
      return {
        success: true,
        output: {
          sentAt: new Date(),
          recipients: config.settings?.recipients || []
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * Creates a map of step handlers
 */
export function createStepHandlers(): Map<WorkflowStepType, StepHandler> {
  const handlers = new Map<WorkflowStepType, StepHandler>()
  
  handlers.set('TASK', new TaskStepHandler())
  handlers.set('APPROVAL', new ApprovalStepHandler())
  handlers.set('NOTIFICATION', new NotificationStepHandler())
  
  return handlers
} 