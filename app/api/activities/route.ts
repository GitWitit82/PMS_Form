/**
 * Activities API Route
 * Handles activity logging and retrieval
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * POST /api/activities
 * Creates a new activity log
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.type || !data.entityType || !data.entityId || !data.action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        user_id: parseInt(session.user.id),
        type: data.type,
        entity_type: data.entityType,
        entity_id: data.entityId,
        action: data.action,
        details: data.details || {},
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ data: activity })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/activities
 * Retrieves activity logs with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    const where = {
      ...(entityType && entityId ? {
        entity_type: entityType,
        entity_id: parseInt(entityId),
      } : {}),
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ data: activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
} 