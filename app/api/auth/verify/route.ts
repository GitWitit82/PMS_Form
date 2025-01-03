import { NextResponse } from 'next/server'
import { verifyPin } from '@/lib/server/auth-utils'

export async function POST(request: Request) {
  try {
    const { hashedPin, pin } = await request.json()
    const isValid = await verifyPin(pin, hashedPin)
    return NextResponse.json({ isValid })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify PIN' },
      { status: 500 }
    )
  }
} 