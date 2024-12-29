import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { hashPin } from '@/lib/auth'
import { UserRole } from "@/types"
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Not authenticated', { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Not authorized - Admin access required', { status: 403 })
    }

    const body = await req.json()
    const { username, pin, email, role } = body

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return new NextResponse(`Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`, { status: 400 })
    }

    // Validate PIN
    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      return new NextResponse('PIN must be exactly 4 digits', { status: 400 })
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return new NextResponse('Username already exists', { status: 400 })
    }

    // Create new user
    const hashedPin = await hashPin(pin)
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        role: role as UserRole,
        pin_hash: hashedPin
      }
    })

    return NextResponse.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Create user error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = error.meta?.target as string[]
        return new NextResponse(
          `A user with this ${field?.[0] || 'credential'} already exists`,
          { status: 400 }
        )
      }
    }

    return new NextResponse(
      'Failed to create user. Please try again.',
      { status: 500 }
    )
  }
} 