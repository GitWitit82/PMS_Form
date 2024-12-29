import Link from "next/link"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
} 