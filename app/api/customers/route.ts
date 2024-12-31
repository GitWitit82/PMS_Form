import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET handler for fetching all customers
 * @returns {Promise<NextResponse>} JSON response containing customers data or error message
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const customers = await prisma.customer.findMany({
      select: {
        customer_id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return new NextResponse(
      JSON.stringify(customers),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error fetching customers:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch customers' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 