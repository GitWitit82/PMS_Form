import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * GET handler for fetching all forms
 * @returns {Promise<NextResponse>} JSON response containing forms data or error message
 */
export async function GET() {
  try {
    // First test the database connection
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (connError) {
      console.error('Database connection failed:', connError)
      return new NextResponse(
        JSON.stringify({ error: 'Database connection failed' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Log the query we're about to execute
    console.log('Executing form query...')

    const forms = await prisma.form.findMany({
      include: {
        department: true,
        templates: {
          where: {
            is_active: true
          },
          orderBy: {
            version: 'desc'
          },
          take: 1
        },
        workflowTasks: {
          include: {
            workflowTask: {
              select: {
                name: true,
                stage: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    console.log(`Found ${forms.length} forms`)

    if (!forms) {
      return new NextResponse(
        JSON.stringify({ data: [] }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const transformedForms = forms.map(form => ({
      form_id: form.form_id,
      title: form.title,
      description: form.description || '',
      type: form.type,
      department: {
        name: form.department?.name || 'Unknown',
        color: form.department?.color || '#000000'
      },
      workflowTasks: form.workflowTasks.map(wt => ({
        name: wt.workflowTask?.name || '',
        stage: wt.workflowTask?.stage || ''
      }))
    }))

    return new NextResponse(
      JSON.stringify({ data: transformedForms }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    // Log the full error for debugging
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    })

    let errorMessage = 'Internal server error'
    let statusCode = 500

    if (error instanceof Prisma.PrismaClientInitializationError) {
      errorMessage = 'Database connection failed'
      statusCode = 503
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${error.message}`
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = 'Invalid database query'
      console.error('Validation error:', error.message)
    }

    return new NextResponse(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      }),
      {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } finally {
    // Always disconnect after the operation
    await prisma.$disconnect()
  }
} 