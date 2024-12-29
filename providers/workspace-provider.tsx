/**
 * WorkspaceProvider: Global application state management
 * Handles theme, notifications, and global UI state
 */
'use client'

import React, { createContext, useContext, useReducer } from 'react'

interface WorkspaceState {
  sidebarOpen: boolean
}

interface WorkspaceContextType {
  state: WorkspaceState
  toggleSidebar: () => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

type WorkspaceAction = { type: 'TOGGLE_SIDEBAR' }

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      }
    default:
      return state
  }
}

const initialState: WorkspaceState = {
  sidebarOpen: true,
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)

  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' })

  return (
    <WorkspaceContext.Provider value={{ state, toggleSidebar }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
} 