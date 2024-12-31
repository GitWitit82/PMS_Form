export interface ProjectFormData {
  name: string
  vin?: string
  invoice_number?: string
  project_type: {
    full_wrap: boolean
    partial: boolean
    decals: boolean
    perf: boolean
    removal: boolean
    third_party: boolean
    bodywork: boolean
  }
  customer_id: number
  description?: string
  status: string
}

export interface TravelerData extends ProjectFormData {
  date: string
  steps: Array<{
    id: string | number
    title: string
    notes?: string
    completed: boolean
    completed_at?: string
    completed_by?: string
  }>
} 