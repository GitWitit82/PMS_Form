'use client'

import { useState, useRef } from 'react'
import { UserRole } from '@/types'

export function CreateUserForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      pin: formData.get('pin') as string,
      role: formData.get('role') as UserRole
    }

    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(responseText || 'Failed to create user')
      }

      // Reset form and show success message
      form.reset()
      setSuccess('User created successfully!')
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-3">
          {success}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="pin" className="block text-sm font-medium mb-1">
            PIN (4 digits)
          </label>
          <input
            type="password"
            id="pin"
            name="pin"
            required
            pattern="[0-9]{4}"
            maxLength={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter 4-digit PIN"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Select a role</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.CEO}>CEO</option>
            <option value={UserRole.PROJECT_MGT}>Project Management</option>
            <option value={UserRole.STAFF}>Staff</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            Creating...
          </span>
        ) : (
          'Create User'
        )}
      </button>
    </form>
  )
} 