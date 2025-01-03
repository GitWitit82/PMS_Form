'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { validateCredentials } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    pin: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const validation = validateCredentials(formData.username, formData.pin)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid credentials')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        pin: formData.pin,
        redirect: false,
        callbackUrl: searchParams?.get('callbackUrl') || '/'
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Enter your username"
              autoComplete="username"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              PIN
            </label>
            <Input
              id="pin"
              type="password"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              required
              maxLength={4}
              pattern="\d{4}"
              placeholder="Enter your 4-digit PIN"
              autoComplete="current-password"
              className="h-10"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
} 