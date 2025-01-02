import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const resources = await prisma.resource.findMany({
      include: {
        Department: true,
        Task: true,
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error in GET /api/resources:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 