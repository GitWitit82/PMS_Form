import { NextResponse } from 'next/server'
import { hashPin } from '@/lib/server/auth-utils'

export async function POST(request: Request) {
  try {
    const { pin } = await request.json()
    const hashedPin = await hashPin(pin)
    return NextResponse.json({ hash: hashedPin })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to hash PIN' },
      { status: 500 }
    )
  }
} 