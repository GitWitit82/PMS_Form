/**
 * Departments API Routes
 * Handles CRUD operations for departments
 */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error in GET /api/departments:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// POST /api/departments
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug log

    if (!session?.user) {
      console.log('No session found') // Debug log
      return new NextResponse('Unauthorized - No session', { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    console.log('Request body:', body) // Debug log

    const { name, description, color } = body

    // Validate required fields
    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        description: description || null,
        color: color || '#2563eb', // Default blue color
      },
    })

    console.log('Created department:', department) // Debug log
    return NextResponse.json(department)
  } catch (error: any) {
    console.error('Error in POST /api/departments:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return new NextResponse('Department name already exists', { status: 400 })
    }

    return new NextResponse(error.message || 'Internal error', { status: 500 })
  }
}

// DELETE /api/departments
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new NextResponse('Department ID is required', { status: 400 })
    }

    await prisma.department.delete({
      where: {
        department_id: parseInt(id),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error in DELETE /api/departments:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 