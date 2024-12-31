/**
 * Projects API Routes
 * Handles CRUD operations for projects
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  vin: z.string().optional(),
  invoice_number: z.string().optional(),
  project_type: z.object({
    full_wrap: z.boolean().default(false),
    partial: z.boolean().default(false),
    decals: z.boolean().default(false),
    perf: z.boolean().default(false),
    removal: z.boolean().default(false),
    third_party: z.boolean().default(false),
    bodywork: z.boolean().default(false),
  }),
  customer_id: z.number(),
  description: z.string().optional(),
  status: z.string(),
})

/**
 * GET /api/projects
 * Fetch all projects
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
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
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        vin_number: validatedData.vin,
        invoice_number: validatedData.invoice_number,
        customer_id: validatedData.customer_id,
        description: validatedData.description,
        status: validatedData.status,
        project_type: validatedData.project_type,
      },
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid project data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
} 