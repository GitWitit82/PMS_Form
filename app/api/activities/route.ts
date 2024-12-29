/**
 * Activities API Routes
 * Handles logging and retrieving user activities
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

/**
 * GET /api/activities
 * Retrieves activities based on query parameters
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    if (userId) where.user_id = parseInt(userId)
    if (entityType) where.entity_type = entityType
    if (entityId) where.entity_id = parseInt(entityId)

    const activities = await prisma.activity.findMany({
      where,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ data: activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 