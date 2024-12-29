/**
 * WorkflowProvider: Manages workflow states and transitions
 * Handles workflow templates, steps, and progress tracking
 */
'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { FormTemplate } from './form-provider'

export type WorkflowStepType = 'task' | 'form' | 'approval' | 'notification' | 'conditional'

export type WorkflowStep = {
  id: string
  type: WorkflowStepType
  name: string
  description?: string
  assignee?: string
  dueDate?: Date
  formTemplate?: FormTemplate
  dependencies?: string[]
  conditions?: {
    field: string
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan'
    value: any
  }[]
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped'
  completedAt?: Date
  completedBy?: string
}

export type Workflow = {
  id: string
  name: string
  description?: string
  steps: WorkflowStep[]
  currentStepId?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  progress: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

type WorkflowState = {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  activeSteps: WorkflowStep[]
  loading: boolean
}

type WorkflowAction =
  | { type: 'SET_WORKFLOWS'; payload: Workflow[] }
  | { type: 'SET_CURRENT_WORKFLOW'; payload: Workflow | null }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_STEP'; payload: { workflowId: string; step: WorkflowStep } }
  | { type: 'SET_ACTIVE_STEPS'; payload: WorkflowStep[] }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  activeSteps: [],
  loading: false,
}

const WorkflowContext = createContext<{
  state: WorkflowState
  dispatch: React.Dispatch<WorkflowAction>
  setWorkflows: (workflows: Workflow[]) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  updateWorkflow: (workflow: Workflow) => void
  updateStep: (workflowId: string, step: WorkflowStep) => void
  calculateNextSteps: (workflow: Workflow) => WorkflowStep[]
  isStepAvailable: (step: WorkflowStep, workflow: Workflow) => boolean
  getWorkflowProgress: (workflow: Workflow) => number
} | null>(null)

const workflowReducer = (state: WorkflowState, action: WorkflowAction): WorkflowState => {
  switch (action.type) {
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload }
    case 'SET_CURRENT_WORKFLOW':
      return { ...state, currentWorkflow: action.payload }
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
        currentWorkflow:
          state.currentWorkflow?.id === action.payload.id
            ? action.payload
            : state.currentWorkflow,
      }
    case 'UPDATE_STEP':
      return {
        ...state,
        workflows: state.workflows.map((w) =>
          w.id === action.payload.workflowId
            ? {
                ...w,
                steps: w.steps.map((s) =>
                  s.id === action.payload.step.id ? action.payload.step : s
                ),
              }
            : w
        ),
        currentWorkflow:
          state.currentWorkflow?.id === action.payload.workflowId
            ? {
                ...state.currentWorkflow,
                steps: state.currentWorkflow.steps.map((s) =>
                  s.id === action.payload.step.id ? action.payload.step : s
                ),
              }
            : state.currentWorkflow,
      }
    case 'SET_ACTIVE_STEPS':
      return { ...state, activeSteps: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export const WorkflowProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(workflowReducer, initialState)

  const setWorkflows = useCallback((workflows: Workflow[]) => {
    dispatch({ type: 'SET_WORKFLOWS', payload: workflows })
  }, [])

  const setCurrentWorkflow = useCallback((workflow: Workflow | null) => {
    dispatch({ type: 'SET_CURRENT_WORKFLOW', payload: workflow })
  }, [])

  const updateWorkflow = useCallback((workflow: Workflow) => {
    dispatch({ type: 'UPDATE_WORKFLOW', payload: workflow })
  }, [])

  const updateStep = useCallback((workflowId: string, step: WorkflowStep) => {
    dispatch({ type: 'UPDATE_STEP', payload: { workflowId, step } })
  }, [])

  const isStepAvailable = useCallback((step: WorkflowStep, workflow: Workflow): boolean => {
    if (!step.dependencies?.length) return true

    return step.dependencies.every((depId) => {
      const depStep = workflow.steps.find((s) => s.id === depId)
      return depStep?.status === 'completed'
    })
  }, [])

  const evaluateCondition = useCallback(
    (condition: WorkflowStep['conditions'][0], formData: Record<string, any>): boolean => {
      const value = formData[condition.field]
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'notEquals':
          return value !== condition.value
        case 'contains':
          return value?.includes(condition.value)
        case 'greaterThan':
          return value > condition.value
        case 'lessThan':
          return value < condition.value
        default:
          return false
      }
    },
    []
  )

  const calculateNextSteps = useCallback(
    (workflow: Workflow): WorkflowStep[] => {
      return workflow.steps.filter((step) => {
        if (step.status !== 'pending') return false
        if (!isStepAvailable(step, workflow)) return false

        // Evaluate conditions if they exist
        if (step.conditions?.length) {
          // This would need to be connected to your form data
          const formData = {} // Get form data from your form context
          return step.conditions.every((condition) => evaluateCondition(condition, formData))
        }

        return true
      })
    },
    [isStepAvailable, evaluateCondition]
  )

  const getWorkflowProgress = useCallback((workflow: Workflow): number => {
    const totalSteps = workflow.steps.length
    if (totalSteps === 0) return 0

    const completedSteps = workflow.steps.filter(
      (step) => step.status === 'completed' || step.status === 'skipped'
    ).length

    return Math.round((completedSteps / totalSteps) * 100)
  }, [])

  return (
    <WorkflowContext.Provider
      value={{
        state,
        dispatch,
        setWorkflows,
        setCurrentWorkflow,
        updateWorkflow,
        updateStep,
        calculateNextSteps,
        isStepAvailable,
        getWorkflowProgress,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
} 