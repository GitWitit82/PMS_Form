'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    'CredentialsSignin': 'Invalid username or PIN',
    'Default': 'An error occurred during authentication'
  }

  const errorMessage = errorMessages[error || ''] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-primary hover:text-primary/80 underline"
          >
            Return to Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
} 