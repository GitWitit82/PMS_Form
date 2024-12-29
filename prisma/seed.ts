import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create the standard workflow
  await prisma.workflow.create({
    data: {
      name: "Standard Project Workflow",
      description: "Standard workflow template for project management",
      workflowTasks: {
        create: [
          // Stage 1 - Project Initiation
          {
            name: "Initial Contact",
            description: "First contact with lead or prospect",
            priority: "HIGH",
            stage: "PROJECT_INITIATION",
            order: 1
          },
          {
            name: "Create Folder & Traveler",
            description: "Work order creation and documentation setup",
            priority: "HIGH",
            stage: "PROJECT_INITIATION",
            order: 2
          },
          {
            name: "Create Sticky Board Entry",
            description: "Add project to tracking board",
            priority: "MEDIUM",
            stage: "PROJECT_INITIATION",
            order: 3
          },
          {
            name: "Pre-Development Meeting",
            description: "Initial meeting (Phone/In Person)",
            priority: "HIGH",
            stage: "PROJECT_INITIATION",
            order: 4
          },
          {
            name: "Initial Invoice Creation",
            description: "Create initial invoice (50% of total or $500 deposit)",
            priority: "HIGH",
            stage: "PROJECT_INITIATION",
            order: 5
          },
          
          // Stage 2 - Design Development
          {
            name: "Creative Concept Meeting",
            description: "Discuss creative direction (Phone/In Person)",
            priority: "HIGH",
            stage: "DESIGN_DEVELOPMENT",
            order: 6
          },
          {
            name: "Collect Materials",
            description: "Follow-up email to collect collaterals & terms",
            priority: "HIGH",
            stage: "DESIGN_DEVELOPMENT",
            order: 7
          },
          {
            name: "Create Rough Mockup",
            description: "Develop initial RES/PNG template",
            priority: "HIGH",
            stage: "DESIGN_DEVELOPMENT",
            order: 8
          },
          {
            name: "Photo Documentation",
            description: "Capture and organize project photos & sizing",
            priority: "MEDIUM",
            stage: "DESIGN_DEVELOPMENT",
            order: 9
          },
          {
            name: "Physical Inspection",
            description: "On-site inspection and additional services assessment",
            priority: "HIGH",
            stage: "DESIGN_DEVELOPMENT",
            order: 10
          },
          {
            name: "Update Invoice",
            description: "Review and update invoice based on requirements",
            priority: "HIGH",
            stage: "DESIGN_DEVELOPMENT",
            order: 11
          },

          // Stage 3 - Design Execution
          {
            name: "Pre-Design Layout Meeting",
            description: "Final design planning meeting",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 12
          },
          {
            name: "Template Creation",
            description: "Create and verify design template",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 13
          },
          {
            name: "High-Res Design",
            description: "Create high resolution design",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 14
          },
          {
            name: "Art Direction Approval",
            description: "Internal design approval",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 15
          },
          {
            name: "Customer Approval",
            description: "Client sign-off on design",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 16
          },
          {
            name: "Finalize Design",
            description: "Complete final design adjustments",
            priority: "HIGH",
            stage: "DESIGN_EXECUTION",
            order: 17
          },

          // Stage 4 - Production Setup
          {
            name: "Internal Proofing",
            description: "Internal review of final design",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 18
          },
          {
            name: "Final Art Direction Approval",
            description: "Final internal design approval",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 19
          },
          {
            name: "Final Customer Approval",
            description: "Final client sign-off",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 20
          },
          {
            name: "Deposit Confirmation",
            description: "Verify 50% deposit payment",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 21
          },
          {
            name: "Schedule Installation",
            description: "Set firm installation/delivery date",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 22
          },
          {
            name: "Material Procurement",
            description: "Order necessary raw materials",
            priority: "HIGH",
            stage: "PRODUCTION_SETUP",
            order: 23
          },

          // Stage 5 - Production
          {
            name: "Create Installer Sheet",
            description: "Prepare installation documentation",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 24
          },
          {
            name: "Print Ready Review",
            description: "Review blueprints and print files",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 25
          },
          {
            name: "Pre-Install Meeting",
            description: "Installation team briefing",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 26
          },
          {
            name: "Paneling Process",
            description: "Complete paneling work",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 27
          },
          {
            name: "Printing Process",
            description: "Execute printing phase",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 28
          },
          {
            name: "Lamination and QC",
            description: "Lamination and initial quality check",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 29
          },
          {
            name: "Trim and Sew",
            description: "Complete trim and sewing work",
            priority: "HIGH",
            stage: "PRODUCTION",
            order: 30
          },

          // Stage 6 - Installation and Quality Control
          {
            name: "Plot Setup",
            description: "Prepare installation plot",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 31
          },
          {
            name: "Inventory Control",
            description: "Project inventory check and quality control",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 32
          },
          {
            name: "Item Intake",
            description: "Receive and process items",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 33
          },
          {
            name: "Wrap Plan Setup",
            description: "Prepare wrap plan",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 34
          },
          {
            name: "Surface Preparation",
            description: "Repairs & vinyl/adhesive removals",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 35
          },
          {
            name: "Clean and Prep",
            description: "Surface cleaning and preparation",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 36
          },
          {
            name: "Dry Fit",
            description: "Dry hang and photo documentation",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 37
          },
          {
            name: "Installation",
            description: "On-location installation",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 38
          },
          {
            name: "Post-Wrap Process",
            description: "Complete post-wrap procedures",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 39
          },
          {
            name: "Final QC",
            description: "Quality control and photo documentation",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 40
          },
          {
            name: "Balance Settlement",
            description: "Process final payment",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 41
          },
          {
            name: "Project Reveal",
            description: "Final reveal and client handover",
            priority: "HIGH",
            stage: "INSTALLATION",
            order: 42
          },
          {
            name: "Department Debrief",
            description: "Final team debrief",
            priority: "MEDIUM",
            stage: "INSTALLATION",
            order: 43
          },

          // Final Stage
          {
            name: "Project Closure",
            description: "File paperwork and update social media",
            priority: "HIGH",
            stage: "COMPLETION",
            order: 44
          }
        ]
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 