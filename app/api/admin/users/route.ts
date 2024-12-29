import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/types"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Not authenticated", { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse("Not authorized - Admin access required", { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      }
    })

    console.log('Found users:', users) // Debug log
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Fetch users error:', error)
    return new NextResponse(
      error.message || 'Failed to fetch users',
      { status: error.status || 500 }
    )
  }
} 