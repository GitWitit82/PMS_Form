/**
 * Project Form Component
 * Handles project creation and updates with proper error handling
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { logActivity } from '@/lib/activity-logger'

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Project description must be at least 10 characters.',
  }),
  customer_id: z.string({
    required_error: 'Please select a customer.',
  }),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'], {
    required_error: 'Please select a status.',
  }),
  vin_number: z.string().optional(),
  invoice_number: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  customers: Array<{ customer_id: number; name: string }> | undefined
  initialData?: {
    project_id: number
    name: string
    description?: string | null
    customer_id: number
    start_date?: Date | null
    end_date?: Date | null
    status: string
    vin_number?: string | null
    invoice_number?: string | null
  }
  onSuccess?: () => void
}

export function ProjectForm({ customers = [], initialData, onSuccess }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      customer_id: initialData?.customer_id.toString() || '',
      status: initialData?.status || 'PENDING',
      vin_number: initialData?.vin_number || '',
      invoice_number: initialData?.invoice_number || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        initialData
          ? `/api/projects/${initialData.project_id}`
          : '/api/projects',
        {
          method: initialData ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            customer_id: parseInt(data.customer_id),
            vin_number: data.vin_number || null,
            invoice_number: data.invoice_number || null,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Something went wrong')
      }

      const result = await response.json()

      try {
        // Log the activity
        await logActivity({
          type: 'project',
          entityType: 'project',
          entityId: initialData?.project_id || result.data.project_id,
          action: initialData ? 'update' : 'create',
          details: {
            name: data.name,
            customer: customers.find(c => c.customer_id === parseInt(data.customer_id))?.name,
            status: data.status,
          },
        })
      } catch (error) {
        console.error('Failed to log activity:', error)
        // Don't throw here, as the main operation succeeded
      }

      toast({
        title: initialData ? 'Project updated' : 'Project created',
        description: initialData
          ? 'Your project has been updated successfully.'
          : 'Your new project has been created successfully.',
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/projects/${initialData ? initialData.project_id : result.data.project_id}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the project scope and objectives.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem
                        key={customer.customer_id}
                        value={customer.customer_id.toString()}
                      >
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The customer associated with this project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Current status of the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vin_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter VIN number (optional)" {...field} />
              </FormControl>
              <FormDescription>
                Vehicle Identification Number if applicable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoice_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter invoice number (optional)" {...field} />
              </FormControl>
              <FormDescription>
                Associated invoice number if available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            'Saving...'
          ) : initialData ? (
            'Update Project'
          ) : (
            'Create Project'
          )}
        </Button>
      </form>
    </Form>
  )
} 