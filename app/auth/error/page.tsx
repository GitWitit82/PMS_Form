'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    'CredentialsSignin': 'Invalid username or PIN. Please check your credentials and try again.',
    'SessionRequired': 'Please sign in to access this page.',
    'AccessDenied': 'You do not have permission to access this page.',
    'Default': 'An error occurred during authentication. Please try again.'
  }

  const errorMessage = errorMessages[error || ''] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="default"
            asChild
            className="w-full"
          >
            <Link href="/auth/signin">
              Return to Sign In
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
} 