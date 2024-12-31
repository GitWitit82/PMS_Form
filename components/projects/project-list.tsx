'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlusIcon, SearchIcon } from 'lucide-react'
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

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch projects')
        }

        setProjects(result.data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectProgress = (project: Project) => {
    const totalTasks = project.Task?.length || 0
    if (totalTasks === 0) return 0
    const completedTasks = project.Task.filter(
      (task) => task.status === 'Completed'
    ).length
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const filteredProjects = Array.isArray(projects) 
    ? projects.filter((project) => {
        const matchesSearch =
          searchQuery === '' ||
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.Customer.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
          statusFilter === 'all' || project.status === statusFilter

        return matchesSearch && matchesStatus
      })
    : []

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => window.location.href = '/projects/new'}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow
                  key={project.project_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/projects/${project.project_id}`}
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.Customer.name}</TableCell>
                  <TableCell>
                    {project.start_date && project.end_date ? (
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(project.start_date), 'MMM d, yyyy')} -{' '}
                        {format(new Date(project.end_date), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No dates set
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${getProjectProgress(project)}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {project.Task?.length || 0} tasks
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 