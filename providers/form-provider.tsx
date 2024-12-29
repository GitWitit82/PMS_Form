/**
 * FormProvider: Handles dynamic form state and validation
 * Manages form templates, validation rules, and form submissions
 */
'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { z } from 'zod'

// Form field types supported by the system
export type FormFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'file'

// Form field configuration
export type FormField = {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  validation?: z.ZodType<any>
  defaultValue?: any
  description?: string
  disabled?: boolean
}

// Form template definition
export type FormTemplate = {
  id: string
  name: string
  description?: string
  fields: FormField[]
  validationSchema?: z.ZodType<any>
}

// Form state type
type FormState = {
  templates: FormTemplate[]
  currentTemplate: FormTemplate | null
  formData: Record<string, any>
  errors: Record<string, string[]>
  isSubmitting: boolean
}

// Form actions
type FormAction =
  | { type: 'SET_TEMPLATES'; payload: FormTemplate[] }
  | { type: 'SET_CURRENT_TEMPLATE'; payload: FormTemplate | null }
  | { type: 'SET_FORM_DATA'; payload: Record<string, any> }
  | { type: 'SET_ERRORS'; payload: Record<string, string[]> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }

const initialState: FormState = {
  templates: [],
  currentTemplate: null,
  formData: {},
  errors: {},
  isSubmitting: false,
}

const FormContext = createContext<{
  state: FormState
  dispatch: React.Dispatch<FormAction>
  setTemplates: (templates: FormTemplate[]) => void
  setCurrentTemplate: (template: FormTemplate | null) => void
  updateFormData: (data: Record<string, any>) => void
  setErrors: (errors: Record<string, string[]>) => void
  setSubmitting: (isSubmitting: boolean) => void
  resetForm: () => void
  validateField: (fieldId: string, value: any) => boolean
  validateForm: () => boolean
} | null>(null)

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload }
    case 'SET_CURRENT_TEMPLATE':
      return { ...state, currentTemplate: action.payload, formData: {}, errors: {} }
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } }
    case 'SET_ERRORS':
      return { ...state, errors: action.payload }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }
    case 'RESET_FORM':
      return { ...state, formData: {}, errors: {}, isSubmitting: false }
    default:
      return state
  }
}

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const setTemplates = useCallback((templates: FormTemplate[]) => {
    dispatch({ type: 'SET_TEMPLATES', payload: templates })
  }, [])

  const setCurrentTemplate = useCallback((template: FormTemplate | null) => {
    dispatch({ type: 'SET_CURRENT_TEMPLATE', payload: template })
  }, [])

  const updateFormData = useCallback((data: Record<string, any>) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data })
  }, [])

  const setErrors = useCallback((errors: Record<string, string[]>) => {
    dispatch({ type: 'SET_ERRORS', payload: errors })
  }, [])

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: isSubmitting })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const validateField = useCallback(
    (fieldId: string, value: any): boolean => {
      if (!state.currentTemplate) return true

      const field = state.currentTemplate.fields.find((f) => f.id === fieldId)
      if (!field || !field.validation) return true

      try {
        field.validation.parse(value)
        const newErrors = { ...state.errors }
        delete newErrors[fieldId]
        dispatch({ type: 'SET_ERRORS', payload: newErrors })
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          dispatch({
            type: 'SET_ERRORS',
            payload: { ...state.errors, [fieldId]: error.errors.map((e) => e.message) },
          })
        }
        return false
      }
    },
    [state.currentTemplate, state.errors]
  )

  const validateForm = useCallback((): boolean => {
    if (!state.currentTemplate) return true

    if (state.currentTemplate.validationSchema) {
      try {
        state.currentTemplate.validationSchema.parse(state.formData)
        dispatch({ type: 'SET_ERRORS', payload: {} })
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string[]> = {}
          error.errors.forEach((err) => {
            const path = err.path.join('.')
            if (!errors[path]) errors[path] = []
            errors[path].push(err.message)
          })
          dispatch({ type: 'SET_ERRORS', payload: errors })
        }
        return false
      }
    }

    return state.currentTemplate.fields.every((field) =>
      validateField(field.id, state.formData[field.id])
    )
  }, [state.currentTemplate, state.formData, validateField])

  return (
    <FormContext.Provider
      value={{
        state,
        dispatch,
        setTemplates,
        setCurrentTemplate,
        updateFormData,
        setErrors,
        setSubmitting,
        resetForm,
        validateField,
        validateForm,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }
  return context
} 