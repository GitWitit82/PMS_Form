import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function hashPin(pin: string): Promise<string> {
  return await bcrypt.hash(pin, 10)
}

async function main() {
  // Create default admin user
  const adminPin = '1234' // Default PIN for admin
  const hashedPin = await hashPin(adminPin)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      pin_hash: hashedPin,
      role: UserRole.ADMIN
    }
  })

  console.log('Created admin user:', admin)

  // Create sample customers
  const customers = [
    {
      customer_id: 1,
      name: 'Acme Corporation',
      email: 'contact@acmecorp.com',
      phone: '555-0123',
    },
    {
      customer_id: 2,
      name: 'Pacific Northwest Motors',
      email: 'fleet@pnwmotors.com',
      phone: '555-0124',
    },
    {
      customer_id: 3,
      name: 'Downtown Retail Group',
      email: 'signs@drg.com',
      phone: '555-0125',
    }
  ]

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { customer_id: customer.customer_id },
      update: customer,
      create: customer,
    })
  }

  console.log('Created sample customers')

  // Create sample projects
  const projects = [
    {
      project_id: 1,
      name: 'Fleet Vehicle Wraps',
      description: 'Full vehicle wrap for delivery fleet',
      customer_id: 1,
      status: 'In Progress',
      vin_number: 'ABC123XYZ456789',
      invoice_number: 'INV-2024-001'
    },
    {
      project_id: 2,
      name: 'Retail Store Signs',
      description: 'Interior and exterior signage for new store location',
      customer_id: 3,
      status: 'Not Started',
      invoice_number: 'INV-2024-002'
    },
    {
      project_id: 3,
      name: 'Service Van Graphics',
      description: 'Partial wrap and decals for service van fleet',
      customer_id: 2,
      status: 'In Progress',
      vin_number: 'XYZ789ABC123456',
      invoice_number: 'INV-2024-003'
    }
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { project_id: project.project_id },
      update: project,
      create: project,
    })
  }

  console.log('Created sample projects')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 