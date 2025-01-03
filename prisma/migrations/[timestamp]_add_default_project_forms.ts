import { PrismaClient } from '@prisma/client'
import { defaultProjectForms } from '@/lib/project-forms'

const prisma = new PrismaClient()

export async function up() {
  for (const form of defaultProjectForms) {
    await prisma.form.create({
      data: {
        ...form,
        templates: {
          create: {
            name: form.title,
            description: form.description,
            version: 1,
            is_active: true,
            fields: form.fields
          }
        }
      }
    })
  }
}

export async function down() {
  await prisma.form.deleteMany({
    where: {
      type: {
        in: ['PROJECT_CHECKLIST', 'QUALITY_CONTROL', 'CUSTOMER_APPROVAL']
      }
    }
  })
} 