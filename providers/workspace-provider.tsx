/**
 * WorkspaceProvider: Global application state management
 * Handles theme, notifications, and global UI state
 */
'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { Toaster } from 'sonner'

type WorkspaceState = {
  sidebarOpen: boolean
  currentProject: string | null
  currentWorkflow: string | null
  loading: boolean
  theme: 'light' | 'dark' | 'system'
}

type WorkspaceAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PROJECT'; payload: string | null }
  | { type: 'SET_WORKFLOW'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }

const initialState: WorkspaceState = {
  sidebarOpen: true,
  currentProject: null,
  currentWorkflow: null,
  loading: false,
  theme: 'system',
}

const WorkspaceContext = createContext<{
  state: WorkspaceState
  dispatch: React.Dispatch<WorkspaceAction>
  toggleSidebar: () => void
  setCurrentProject: (projectId: string | null) => void
  setCurrentWorkflow: (workflowId: string | null) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
} | null>(null)

const workspaceReducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'SET_PROJECT':
      return { ...state, currentProject: action.payload }
    case 'SET_WORKFLOW':
      return { ...state, currentWorkflow: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    default:
      return state
  }
}

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }, [])

  const setCurrentProject = useCallback((projectId: string | null) => {
    dispatch({ type: 'SET_PROJECT', payload: projectId })
  }, [])

  const setCurrentWorkflow = useCallback((workflowId: string | null) => {
    dispatch({ type: 'SET_WORKFLOW', payload: workflowId })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        dispatch,
        toggleSidebar,
        setCurrentProject,
        setCurrentWorkflow,
        setLoading,
        setTheme,
      }}
    >
      {children}
      <Toaster position="top-right" />
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
} 