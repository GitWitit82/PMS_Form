import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/types"

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const userId = parseInt(params.userId)

    // Prevent deleting the last admin user
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN }
    })

    const userToDelete = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { role: true }
    })

    if (adminCount === 1 && userToDelete?.role === UserRole.ADMIN) {
      return new NextResponse("Cannot delete the last admin user", { status: 400 })
    }

    await prisma.user.delete({
      where: { user_id: userId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
} 