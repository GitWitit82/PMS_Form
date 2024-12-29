/**
 * Implementation of workflow condition evaluators and action executors
 */

import { ConditionEvaluator, ActionExecutor, WorkflowContext, TransitionRuleConfig } from './types'

/**
 * Default condition evaluator implementation
 */
export class DefaultConditionEvaluator implements ConditionEvaluator {
  /**
   * Evaluates a condition against the workflow context
   */
  async evaluate(
    condition: TransitionRuleConfig['conditions'],
    context: WorkflowContext
  ): Promise<boolean> {
    if (!condition) return true
    if (!condition.rules || condition.rules.length === 0) return true

    const results = await Promise.all(
      condition.rules.map(rule => this.evaluateRule(rule, context))
    )

    return condition.type === 'AND'
      ? results.every(r => r)
      : results.some(r => r)
  }

  /**
   * Evaluates a single rule
   */
  private async evaluateRule(
    rule: TransitionRuleConfig['conditions']['rules'][0],
    context: WorkflowContext
  ): Promise<boolean> {
    const value = this.getValueFromContext(rule.field, context)
    
    switch (rule.operator) {
      case 'eq':
        return value === rule.value
      case 'neq':
        return value !== rule.value
      case 'gt':
        return value > rule.value
      case 'gte':
        return value >= rule.value
      case 'lt':
        return value < rule.value
      case 'lte':
        return value <= rule.value
      case 'contains':
        return typeof value === 'string' && value.includes(String(rule.value))
      case 'not_contains':
        return typeof value === 'string' && !value.includes(String(rule.value))
      default:
        throw new Error(`Unknown operator: ${rule.operator}`)
    }
  }

  /**
   * Gets a value from the workflow context using dot notation
   */
  private getValueFromContext(field: string, context: WorkflowContext): any {
    const parts = field.split('.')
    let value: any = context

    for (const part of parts) {
      if (value === undefined || value === null) return undefined
      value = value[part]
    }

    return value
  }
}

/**
 * Default action executor implementation
 */
export class DefaultActionExecutor implements ActionExecutor {
  private readonly actionHandlers: Map<string, (config: any, context: WorkflowContext) => Promise<void>>

  constructor() {
    this.actionHandlers = new Map()
    this.registerDefaultHandlers()
  }

  /**
   * Registers a new action handler
   */
  registerHandler(
    type: string,
    handler: (config: any, context: WorkflowContext) => Promise<void>
  ): void {
    this.actionHandlers.set(type, handler)
  }

  /**
   * Executes an action
   */
  async execute(
    action: TransitionRuleConfig['actions'][0],
    context: WorkflowContext
  ): Promise<void> {
    const handler = this.actionHandlers.get(action.type)
    
    if (!handler) {
      throw new Error(`No handler registered for action type: ${action.type}`)
    }

    await handler(action.config, context)
  }

  /**
   * Registers default action handlers
   */
  private registerDefaultHandlers(): void {
    // Update context state
    this.registerHandler('UPDATE_STATE', async (config, context) => {
      if (!config.updates || typeof config.updates !== 'object') {
        throw new Error('Invalid update configuration')
      }

      Object.assign(context.state, config.updates)
    })

    // Send notification
    this.registerHandler('SEND_NOTIFICATION', async (config, context) => {
      if (!config.message) {
        throw new Error('Notification message is required')
      }

      // Implement notification logic here
      console.log('Sending notification:', config.message)
    })

    // Create task
    this.registerHandler('CREATE_TASK', async (config, context) => {
      if (!config.taskDetails || typeof config.taskDetails !== 'object') {
        throw new Error('Invalid task configuration')
      }

      // Implement task creation logic here
      console.log('Creating task:', config.taskDetails)
    })

    // Update task
    this.registerHandler('UPDATE_TASK', async (config, context) => {
      if (!config.taskId || !config.updates) {
        throw new Error('Task ID and updates are required')
      }

      // Implement task update logic here
      console.log('Updating task:', config.taskId, config.updates)
    })

    // Log event
    this.registerHandler('LOG_EVENT', async (config, context) => {
      if (!config.event || typeof config.event !== 'object') {
        throw new Error('Invalid event configuration')
      }

      // Implement event logging logic here
      console.log('Logging event:', config.event)
    })
  }
} 