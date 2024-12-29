import type { User, Project, Task } from '@prisma/client'

export type SafeUser = Omit<User, 'pin_hash' | 'created_at'> & {
  created_at: string
}

export type SafeProject = Project & {
  created_at: string
  start_date: string | null
  end_date: string | null
}

export type SafeTask = Task & {
  created_at: string
  scheduled_start_date: string | null
  scheduled_end_date: string | null
  actual_start_date: string | null
  actual_end_date: string | null
} 