'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'

export default function EditorPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editor Dashboard</h1>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Editor Access
        </h2>
        <p className="text-muted-foreground">
          This page is only accessible to editors and administrators.
        </p>
      </Card>
    </div>
  )
} 