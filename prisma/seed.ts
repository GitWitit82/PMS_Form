import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Default users configuration
  const defaultUsers = [
    {
      username: 'admin',
      email: 'admin@example.com',
      pin: '1234',
      role: UserRole.ADMIN
    }
  ]

  console.log('Starting to seed default users...')

  for (const user of defaultUsers) {
    const exists = await prisma.user.findUnique({
      where: { username: user.username }
    })

    if (!exists) {
      const hashedPin = await bcrypt.hash(user.pin, 10)
      await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          pin_hash: hashedPin,
          role: user.role
        }
      })
      console.log(`Created ${user.role} user: ${user.username}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 