/**
 * Project Form Component
 * A form component for creating and managing projects with customer association and project type selection.
 * 
 * @component
 * @example
 * ```tsx
 * <ProjectForm onSuccess={() => console.log('Project created')} />
 * ```
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'

/**
 * Zod schema for project validation
 * Defines the structure and validation rules for project data
 */
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  vin: z.string().optional().default(''),
  invoice_number: z.string().optional().default(''),
  project_type: z.object({
    full_wrap: z.boolean().default(false),
    partial: z.boolean().default(false),
    decals: z.boolean().default(false),
    perf: z.boolean().default(false),
    removal: z.boolean().default(false),
    third_party: z.boolean().default(false),
    bodywork: z.boolean().default(false),
  }),
  customer_id: z.number({
    required_error: 'Customer is required',
  }),
  description: z.string().optional().default(''),
  status: z.string().default('Not Started'),
})

/**
 * Customer interface
 * Defines the structure for customer data used in the form
 */
interface Customer {
  customer_id: number
  name: string
}

/**
 * ProjectForm component props
 */
interface ProjectFormProps {
  /** Callback function called after successful project creation */
  onSuccess?: () => void
}

/**
 * ProjectForm Component
 * Renders a form for creating new projects with customer selection and project type options.
 * 
 * @param props - Component props
 * @param props.onSuccess - Optional callback function called after successful project creation
 */
export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])

  // Fetch customers on component mount
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers')
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch customers')
        }
        setCustomers(result.data || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast.error('Failed to load customers')
      }
    }

    fetchCustomers()
  }, [])

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      vin: '',
      invoice_number: '',
      project_type: {
        full_wrap: false,
        partial: false,
        decals: false,
        perf: false,
        removal: false,
        third_party: false,
        bodywork: false,
      },
      description: '',
      status: 'Not Started',
    },
  })

  /**
   * Handle form submission
   * Creates a new project with the provided data
   * 
   * @param data - Form data matching the project schema
   */
  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create project')
      }

      const result = await response.json()
      toast.success('Project created successfully')
      router.refresh()
      onSuccess?.()
      router.push(`/projects/${result.data.project_id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PROJECT:</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Selection Field */}
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUSTOMER:</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.isArray(customers) && customers.map((customer) => (
                      <SelectItem 
                        key={customer.customer_id} 
                        value={customer.customer_id.toString()}
                      >
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Invoice Number Field */}
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>INVOICE #:</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VIN Number Field */}
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN #:</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Type Selection */}
          <div className="md:col-span-2">
            <Label className="text-xs font-medium">Project Type:</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                { id: 'full_wrap' as const, label: 'FULL WRAP' },
                { id: 'partial' as const, label: 'PARTIAL' },
                { id: 'decals' as const, label: 'DECALS' },
                { id: 'perf' as const, label: 'PERF' },
                { id: 'removal' as const, label: 'REMOVAL' },
                { id: 'third_party' as const, label: '3RD PARTY' },
                { id: 'bodywork' as const, label: 'BODYWORK' },
              ].map(({ id, label }) => (
                <FormField
                  key={id}
                  control={form.control}
                  name={`project_type.${id}` as `project_type.${typeof id}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal">
                        {label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 