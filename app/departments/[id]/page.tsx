/**
 * Department Detail Page
 * Displays and manages department information
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Department } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color code'),
})

type FormData = z.infer<typeof formSchema>

interface DepartmentPageProps {
  params: { id: string }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [department, setDepartment] = useState<Department | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#2563eb',
    },
  })

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`/api/departments/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch department')
        const data = await response.json()
        setDepartment(data)
        form.reset({
          name: data.name,
          description: data.description || '',
          color: data.color,
        })
      } catch (error) {
        console.error('Error fetching department:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch department',
          variant: 'destructive',
        })
      }
    }
    if (params?.id) {
      fetchDepartment()
    }
  }, [params?.id, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/departments/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update department')

      toast({
        title: 'Success',
        description: 'Department updated successfully',
      })

      router.refresh()
      router.push('/departments')
    } catch (error) {
      console.error('Error updating department:', error)
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Department</h1>
        <p className="text-muted-foreground">Update department information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter department name" {...field} />
                </FormControl>
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
                    placeholder="Enter department description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input type="color" {...field} className="w-20 h-10" />
                    <Input
                      type="text"
                      {...field}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/departments')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 