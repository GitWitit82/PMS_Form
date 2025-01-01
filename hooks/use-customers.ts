/**
 * Custom hook for fetching and managing customer data
 */
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'

interface Customer {
  customer_id: number
  name: string
}

interface ApiResponse {
  data?: Customer[]
  error?: string
}

export function useCustomers() {
  const { data: session, status } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCustomers = async () => {
    try {
      // Don't fetch if not authenticated
      if (status === 'unauthenticated') {
        setCustomers([])
        return
      }

      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/customers', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const result: ApiResponse = await response.json()
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid customer data received')
      }

      setCustomers(result.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError(error instanceof Error ? error : new Error('Failed to load customers'))
      toast({
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    fetchCustomers()
  }, [status])

  return {
    customers,
    loading: loading || status === 'loading',
    error,
    refetch: fetchCustomers,
    isAuthenticated: status === 'authenticated'
  }
} 