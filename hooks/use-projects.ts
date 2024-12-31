'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Project {
  project_id: number
  name: string
  Customer: {
    name: string
  }
  start_date?: Date | null
  end_date?: Date | null
  status: string
  Task: Array<{
    task_id: number
    status: string
  }>
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    refetch: fetchProjects
  }
} 