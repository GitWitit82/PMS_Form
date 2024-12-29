import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CreateUserForm } from "@/components/create-user-form"
import { UsersList } from "@/components/users-list"
import { UserRole } from "@/types"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  console.log('Current session:', session) // Debug log

  if (!session || session.user.role !== UserRole.ADMIN) {
    console.log('Redirecting - not admin') // Debug log
    redirect("/auth/signin")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <CreateUserForm />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <UsersList />
      </div>
    </div>
  )
} 