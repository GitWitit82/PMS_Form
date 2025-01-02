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

    const metrics = await prisma.$transaction([
      prisma.project.count(),
      prisma.task.count(),
      prisma.formSubmission.count(),
      // Add more metrics...
    ])

    return NextResponse.json({
      projects: metrics[0],
      tasks: metrics[1],
      forms: metrics[2],
    })
  } catch (error) {
    console.error('Error in GET /api/metrics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 