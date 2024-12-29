import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user if it doesn't exist
  const adminPin = await bcrypt.hash('1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      pin_hash: adminPin,
      role: UserRole.ADMIN,
    },
  })

  // Create standard workflow template
  const workflow = await prisma.workflow.create({
    data: {
      name: 'Standard Workflow',
      description: 'Default workflow template for all projects',
      user_creator: {
        connect: {
          user_id: admin.user_id
        }
      },
      user_updater: {
        connect: {
          user_id: admin.user_id
        }
      },
      steps: {
        create: [
          // Stage 1 - Project Initiation
          {
            name: 'Initial Contact',
            description: 'Lead or Prospect',
            step_type: 'TASK',
            order: 1,
            config: {
              inputs: {
                contactName: { type: 'string', required: true },
                contactEmail: { type: 'string', required: true },
                contactPhone: { type: 'string', required: false },
                notes: { type: 'string', required: false }
              }
            }
          },
          {
            name: 'Create Folder & Traveler',
            description: 'Work Order Made',
            step_type: 'TASK',
            order: 2,
            config: {
              inputs: {
                projectName: { type: 'string', required: true },
                projectNumber: { type: 'string', required: true }
              }
            }
          },
          {
            name: 'Sticky Created & Put on Board',
            step_type: 'TASK',
            order: 3,
            config: {}
          },
          {
            name: 'Pre-Development Meeting',
            description: 'Phone/In Person',
            step_type: 'TASK',
            order: 4,
            config: {
              inputs: {
                meetingDate: { type: 'date', required: true },
                meetingType: { type: 'string', required: true },
                meetingNotes: { type: 'string', required: false }
              }
            }
          },
          {
            name: 'Initial Estimated Invoice',
            description: '50% of total or $500 deposit',
            step_type: 'TASK',
            order: 5,
            config: {
              inputs: {
                estimatedTotal: { type: 'number', required: true },
                depositAmount: { type: 'number', required: true }
              }
            }
          },

          // Stage 2 - Design Development
          {
            name: 'Creative Concept Meeting',
            description: 'Phone/In Person',
            step_type: 'TASK',
            order: 6,
            config: {
              inputs: {
                meetingDate: { type: 'date', required: true },
                conceptNotes: { type: 'string', required: true }
              }
            }
          },
          {
            name: 'Follow-up Email',
            description: 'Collect Collaterals & Terms and Conditions',
            step_type: 'TASK',
            order: 7,
            config: {
              inputs: {
                emailSent: { type: 'boolean', required: true },
                collateralsReceived: { type: 'boolean', required: true }
              }
            }
          },
          {
            name: 'Rough Mockup',
            description: 'New RES/PNG Template',
            step_type: 'TASK',
            order: 8,
            config: {}
          },
          {
            name: 'Photos & Sizing',
            step_type: 'TASK',
            order: 9,
            config: {}
          },
          {
            name: 'Physical Inspection',
            description: 'List of Additional Services Sold/Needed',
            step_type: 'TASK',
            order: 10,
            config: {
              inputs: {
                additionalServices: { type: 'string', required: false }
              }
            }
          },
          {
            name: 'Confirm & Update Invoice',
            step_type: 'TASK',
            order: 11,
            config: {}
          },

          // Stage 3 - Design Execution
          {
            name: 'Pre-Design Layout Meeting',
            step_type: 'TASK',
            order: 12,
            config: {}
          },
          {
            name: 'Create & Verify Template',
            step_type: 'TASK',
            order: 13,
            config: {}
          },
          {
            name: 'Start High-Res Design',
            description: 'Hi RES/Single Side',
            step_type: 'TASK',
            order: 14,
            config: {}
          },
          {
            name: 'Art Direction Sign Off',
            step_type: 'APPROVAL',
            order: 15,
            config: {}
          },
          {
            name: 'Customer Sign Off',
            step_type: 'APPROVAL',
            order: 16,
            config: {}
          },
          {
            name: 'Final Design',
            step_type: 'TASK',
            order: 17,
            config: {}
          },

          // Stage 4 - Production Setup
          {
            name: 'Internal Proof',
            step_type: 'TASK',
            order: 18,
            config: {}
          },
          {
            name: 'Art Direction Sign Off',
            step_type: 'APPROVAL',
            order: 19,
            config: {}
          },
          {
            name: 'Customer Sign Off',
            step_type: 'APPROVAL',
            order: 20,
            config: {}
          },
          {
            name: 'Confirm 50% Deposit',
            description: 'Cash/Credit/Online',
            step_type: 'TASK',
            order: 21,
            config: {
              inputs: {
                paymentMethod: { type: 'string', required: true },
                paymentConfirmed: { type: 'boolean', required: true }
              }
            }
          },
          {
            name: 'Firm Hold',
            description: 'Schedule Install Drop Off',
            step_type: 'TASK',
            order: 22,
            config: {}
          },
          {
            name: 'Order Raw Materials',
            step_type: 'TASK',
            order: 23,
            config: {}
          },

          // Stage 5 - Production
          {
            name: 'Installer Sheet Made',
            step_type: 'TASK',
            order: 24,
            config: {}
          },
          {
            name: 'Print Ready Files Blueprints & Review',
            step_type: 'TASK',
            order: 25,
            config: {}
          },
          {
            name: 'Pre-Install Meeting',
            step_type: 'TASK',
            order: 26,
            config: {}
          },
          {
            name: 'Paneling',
            step_type: 'TASK',
            order: 27,
            config: {}
          },
          {
            name: 'Printing',
            step_type: 'TASK',
            order: 28,
            config: {}
          },
          {
            name: 'Lamination Rough Q.C.',
            step_type: 'TASK',
            order: 29,
            config: {}
          },
          {
            name: 'Trim & Sew',
            step_type: 'TASK',
            order: 30,
            config: {}
          },

          // Stage 6 - Installation and Quality Control
          {
            name: 'Plot',
            step_type: 'TASK',
            order: 31,
            config: {}
          },
          {
            name: 'Project Inventory Control/Q.C.',
            step_type: 'TASK',
            order: 32,
            config: {}
          },
          {
            name: 'Intake of Item',
            step_type: 'TASK',
            order: 33,
            config: {}
          },
          {
            name: 'Wrap Plan Set-up',
            step_type: 'TASK',
            order: 34,
            config: {}
          },
          {
            name: 'Repairs & Vinyl/Adhesive Removals',
            step_type: 'TASK',
            order: 35,
            config: {}
          },
          {
            name: 'Clean & Prep Removals',
            step_type: 'TASK',
            order: 36,
            config: {}
          },
          {
            name: 'Dry Hang & Photo',
            step_type: 'TASK',
            order: 37,
            config: {}
          },
          {
            name: 'Install',
            description: 'On-Location',
            step_type: 'TASK',
            order: 38,
            config: {}
          },
          {
            name: 'Post Wrap',
            step_type: 'TASK',
            order: 39,
            config: {}
          },
          {
            name: 'Q.C. & Photos',
            step_type: 'TASK',
            order: 40,
            config: {}
          },
          {
            name: 'Balance',
            step_type: 'TASK',
            order: 41,
            config: {}
          },
          {
            name: 'Reveal',
            description: 'Confirmed/Flexible/Pick Up/No Reveal/Deliver',
            step_type: 'TASK',
            order: 42,
            config: {
              inputs: {
                revealType: { type: 'string', required: true },
                revealDate: { type: 'date', required: true }
              }
            }
          },
          {
            name: 'Debrief All Depts.',
            step_type: 'TASK',
            order: 43,
            config: {}
          },

          // Final Stage
          {
            name: 'Close Project',
            description: 'File All Paperwork, Update Website & Facebook',
            step_type: 'TASK',
            order: 44,
            config: {
              inputs: {
                paperworkFiled: { type: 'boolean', required: true },
                websiteUpdated: { type: 'boolean', required: true },
                socialMediaUpdated: { type: 'boolean', required: true }
              }
            }
          }
        ]
      }
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 