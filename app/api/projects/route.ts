/**
 * Projects API Route
 * Handles CRUD operations for projects
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/projects
 * Fetches all projects from the database
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      include: {
        Customer: true,
        tasks: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json({ data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects
 * Creates a new project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.customer_id || !data.status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        customer_id: data.customer_id,
        status: data.status,
        vin_number: data.vin_number,
        invoice_number: data.invoice_number,
      },
      include: {
        Customer: true,
      },
    })

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 