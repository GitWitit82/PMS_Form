'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface TaskMetrics {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  delayed_tasks: number
  on_hold_tasks: number
  cancelled_tasks: number
  average_completion_time: number
  average_delay_duration: number
}

interface TaskTrend {
  date: string
  completed: number
  in_progress: number
  delayed: number
}

interface TaskPriority {
  priority: string
  count: number
}

interface TaskReportsProps {
  metrics: TaskMetrics
  trends: TaskTrend[]
  priorities: TaskPriority[]
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

/**
 * A component that displays task reports and analytics
 */
export function TaskReports({
  metrics,
  trends,
  priorities,
}: TaskReportsProps) {
  const completionRate = Math.round(
    (metrics.completed_tasks / metrics.total_tasks) * 100
  )

  const delayRate = Math.round(
    (metrics.delayed_tasks / metrics.total_tasks) * 100
  )

  const formatDuration = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (days > 0) {
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h`
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="priorities">Priorities</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <Badge
                className={
                  completionRate >= 70
                    ? 'bg-green-100 text-green-800'
                    : completionRate >= 50
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {completionRate}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.completed_tasks} / {metrics.total_tasks}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delay Rate
              </CardTitle>
              <Badge
                className={
                  delayRate <= 10
                    ? 'bg-green-100 text-green-800'
                    : delayRate <= 20
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                {delayRate}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.delayed_tasks}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks delayed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Completion Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(metrics.average_completion_time)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per task
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Delay Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(metrics.average_delay_duration)}
              </div>
              <p className="text-xs text-muted-foreground">
                When delayed
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Task Trends</CardTitle>
            <CardDescription>
              Task status distribution over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      format(new Date(value), 'MMM d')
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value), 'PPP')
                    }
                  />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#22c55e"
                    name="Completed"
                  />
                  <Bar
                    dataKey="in_progress"
                    stackId="a"
                    fill="#3b82f6"
                    name="In Progress"
                  />
                  <Bar
                    dataKey="delayed"
                    stackId="a"
                    fill="#ef4444"
                    name="Delayed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="priorities">
        <Card>
          <CardHeader>
            <CardTitle>Task Priorities</CardTitle>
            <CardDescription>
              Distribution of tasks by priority level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorities}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={(entry) =>
                      `${entry.priority}: ${entry.count}`
                    }
                  >
                    {priorities.map((entry, index) => (
                      <Cell
                        key={entry.priority}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 