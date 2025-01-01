/**
 * Department API Route
 * Handles CRUD operations for departments
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Department ID is required' },
      { status: 400 }
    )
  }

  try {
    const departmentId = parseInt(params.id)
    const department = await prisma.department.findUnique({
      where: { department_id: departmentId },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { error: 'Failed to fetch department' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Department ID is required' },
      { status: 400 }
    )
  }

  try {
    const departmentId = parseInt(params.id)
    const data = await request.json()

    const department = await prisma.department.update({
      where: { department_id: departmentId },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Department ID is required' },
      { status: 400 }
    )
  }

  try {
    const departmentId = parseInt(params.id)
    await prisma.department.delete({
      where: { department_id: departmentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
} 