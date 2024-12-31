import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { forms } = body

    // Update all forms in a transaction
    await prisma.$transaction(
      forms.map((form: { form_id: number; page: number }) =>
        prisma.form.update({
          where: { form_id: form.form_id },
          data: { page: form.page }
        })
      )
    )

    return NextResponse.json(
      { message: 'Forms reordered successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error reordering forms:', error)
    return NextResponse.json(
      { error: 'Failed to reorder forms' },
      { status: 500 }
    )
  }
} 