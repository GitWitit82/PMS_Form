/**
 * Department API Routes
 * Handles CRUD operations for departments
 */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.findUnique({
      where: { department_id: parseInt(params.id) },
    })

    if (!department) {
      return new NextResponse('Department not found', { status: 404 })
    }

    return NextResponse.json(department)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user || !['ADMIN', 'CEO'].includes(session.user.role as string)) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const body = await request.json()
    const { name, description, color } = body

    const department = await prisma.department.update({
      where: { department_id: parseInt(params.id) },
      data: {
        name,
        description,
        color,
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
} 