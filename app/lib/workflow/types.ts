/**
 * Core types for the workflow system
 */

import { Workflow, WorkflowStep, WorkflowStatus, WorkflowStepType, WorkflowTransitionType } from '@prisma/client'

/**
 * Configuration for a workflow step
 */
export interface WorkflowStepConfig {
  /** Input parameters required for the step */
  inputs?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'date' | 'object'
      required: boolean
      default?: any
      validation?: {
        pattern?: string
        min?: number
        max?: number
        custom?: string
      }
    }
  }
  /** Output parameters produced by the step */
  outputs?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'date' | 'object'
      description: string
    }
  }
  /** Step-specific configuration */
  settings?: {
    [key: string]: any
  }
  /** Timeout configuration */
  timeout?: {
    duration: number
    action: 'FAIL' | 'SKIP' | 'RETRY'
  }
}

/**
 * Configuration for a transition rule
 */
export interface TransitionRuleConfig {
  /** Conditions that must be met for the transition */
  conditions?: {
    type: 'AND' | 'OR'
    rules: Array<{
      field: string
      operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'not_contains'
      value: any
    }>
  }
  /** Actions to perform during transition */
  actions?: Array<{
    type: string
    config: any
  }>
  /** Timeout configuration */
  timeout?: {
    duration: number
    action: 'FAIL' | 'RETRY'
  }
}

/**
 * Context for a workflow instance
 */
export interface WorkflowContext {
  /** Input data for the workflow */
  input: Record<string, any>
  /** Current state of the workflow */
  state: Record<string, any>
  /** Output data produced by the workflow */
  output: Record<string, any>
  /** Metadata about the workflow execution */
  metadata: {
    startedAt: Date
    lastUpdatedAt: Date
    currentStepId?: number
    status: string
    error?: string
  }
}

/**
 * Result of a workflow step execution
 */
export interface StepExecutionResult {
  success: boolean
  output?: Record<string, any>
  error?: string
  nextStepId?: number
}

/**
 * Interface for step handlers
 */
export interface StepHandler {
  execute(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<StepExecutionResult>
}

/**
 * Interface for condition evaluators
 */
export interface ConditionEvaluator {
  evaluate(
    condition: TransitionRuleConfig['conditions'],
    context: WorkflowContext
  ): Promise<boolean>
}

/**
 * Interface for action executors
 */
export interface ActionExecutor {
  execute(
    action: TransitionRuleConfig['actions'][0],
    context: WorkflowContext
  ): Promise<void>
} 