import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create departments with their colors
  const departments = [
    {
      name: 'Sales',
      description: 'Handles client acquisition, communication, and sales activities.',
      color: '#2563eb' // Blue
    },
    {
      name: 'Project Management',
      description: 'Manages project planning, scheduling, and execution.',
      color: '#7c3aed' // Purple
    },
    {
      name: 'Finance',
      description: 'Handles budgeting, accounting, and financial reporting.',
      color: '#16a34a' // Green
    },
    {
      name: 'Marketing',
      description: 'Responsible for promoting products and services.',
      color: '#ea580c' // Orange
    },
    {
      name: 'Graphic Design',
      description: 'Creates visual concepts and designs for projects.',
      color: '#db2777' // Pink
    },
    {
      name: 'Production',
      description: 'Oversees the manufacturing or production process.',
      color: '#0891b2' // Cyan
    },
    {
      name: 'Prep',
      description: 'Prepares materials and resources for production tasks.',
      color: '#4f46e5' // Indigo
    },
    {
      name: 'Installation',
      description: 'Handles installation of products or services for clients.',
      color: '#0d9488' // Teal
    }
  ]

  // Create or update each department
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: { description: dept.description, color: dept.color },
      create: dept,
    })
  }

  // Create form templates
  const formTemplates = [
    {
      title: 'Graphic Design Checklist',
      department: 'Graphic Design',
      description: 'Quality control checklist for graphic design process',
      instructions: 'Complete each step in order. All items must be checked before proceeding to production.',
      fields: [
        "Art Direction Form Completed",
        "Rough Mock-up Designed & saved to Design In Progress folder",
        "Rough Mock-up sent to Art Director for Approval", 
        "Design sent to customer via GoProof using Proof Sheet",
        "ROUGH MOCK APPROVED BY CLIENT",
        "Pre-design layout meeting had with departments to review vehicle",
        "Template Downloaded from TheBadWrap.com or created from photos - Color Profile: sRGB IEC61966-2.1",
        "Template Confirmed using measurements/areas to avoid & placed in Empty Vehicle Templates",
        "Customer collateral confirmed - usable and located in Collaterals folder on server",
        "High Resolution design made - all sides on confirmed template w/ locked Horizon line",
        "Proof submitted for internal review/spell check and sent to client",
        "FINAL DESIGN APPROVED BY CLIENT -Approval Printed and placed in Traveler",
        "Finalize Files & place in Final Designs folder",
        "IF CUT GRAPHICS ARE INCLUDED IN DESIGN: Cut Graphics created and placed in SummaCut Files folder",
        "Create Cut Graphics Form, Print, and place in traveler",
        "Create Blueprints, Print and place in traveler",
        "All Final Approved all sided proofs printed as separate pages and on one single sheet and placed in traveler",
        "Full-Size Before Pictures printed and placed in traveler",
        "Customer Approval printed and placed in traveler",
        "IF REPEAT PROJECT: After Pictures of last wrap printed and placed in traveler;CHECK Flett Box on print sheet"
      ]
    },
    {
      title: 'Paneling & Prepress Checklist',
      department: 'Production',
      description: 'Quality control checklist for paneling and prepress process',
      instructions: 'Verify each item before proceeding. All steps must be completed in sequence.',
      fields: [
        "Confirmed previous departments paperwork is signed off",
        "Printed approval and final files compared (must be the same)", 
        "Confirmed template verification was completed. Checked Non-wrapable areas",
        "Confirmed proper file settings",
        "Confirmed text has been converted to shape or has anti-aliasing on and is made into smart object",
        "Confirmed proper blue prints/mechanicals/cut graphics form/proofs/photos attached",
        "Confirmed the necessary bleed was added",
        "Spell Check / Contact Info Check Completed",
        "Panels for each side MUST be paneled from final design for THAT side, even if the same",
        "Files zoomed and checked for graphical errors (with template and guides off)",
        "Files checked for issues caused by mirroring sides or elements... ALL SIDES, not just Passenger/Driver",
        "Pre-Install meeting had with installer to set up panel plan and review install",
        "Panel Plan group created in layers",
        "Panels cropped out and saved as TIF files in Print Ready Panels folder",
        "Panel Plan Sheet filled out to confirm measurements",
        "Panel Plan printed for ALL SIDES of vehicle whether side has panels or not",
        "Contact Sheet of cropped panels printed using Adobe Bridge",
        "Confirmed color consistency using Contact Sheet"
      ]
    },
    {
      title: 'Print Process Checklist',
      department: 'Production',
      description: 'Quality control checklist for printing process',
      instructions: 'Follow each step carefully. All items must be verified before starting the print job.',
      fields: [
        "CONFIRMED PRINTER IS UP TO DATE WITH PREVENTATIVE MAINTENANCE",
        "Performed a Full Print Optimization Process",
        "Confirmed that space between print settings in ONYX is .5 for standard; 2.5-3 for cut graphics using plotter",
        "Confirmed that substrate in printer matches job requirements for the project",
        "Confirmed that printer has enough substrate as required for what you just loaded to print. (Add a 5 foot buffer to the requirement be sure you have enough vinyl)",
        "Confirmed that take up roll is attached to vinyl in printer (or a plan for catching vinyl is set)",
        "Confirmed that substrate in printer was advanced if needed for tape marks and/or damaged areas to clear the final printing area",
        "Confirmed that all panels being printed have been TURNED and EXPANDED to ACTUAL PRINT SIZE",
        "Confirmed wrap panels with white backgrounds have crop marks/frame to aid in cutting",
        "Confirm edge clips are in proper position",
        "Confirmed that if multiple PRINT CUTS jobs are being printed, conserve media is NOT selected and they are printed as individual jobs with their own barcodes.",
        "Confirmed that all ink levels in printer are ready to print. MUST BE IN THE SHOP to change inks if any color is less than 10% full or a solid color is being printed.",
        "Changed Ink Cartridges below 10%, if necessary, when setting up printer for overnight printing",
        "Confirmed gutter is included in print MUST GET SIGN OFF TO NOT INCLUDE",
        "Print Test Prints: To test photo quality and colors MUST GET SIGNED; View outside (samples must show key areas; solid, logo, image etc.) Ideal sizes: 5x26 or 5x52 stripes",
        "Before photo printed for rolling wall",
        "Compared Printed Color to Paint Wrap if color Paint Wrap is being used.",
        "If Wrap is from a Fleet (see check box at top of page) Compared Printed Sample to Past Printed Sample/photo(s)",
        "Vinyl usage under 85% must be discussed",
        "Printer must be watched while printing first panel and checked every 10 minutes to confirm no issues occur"
      ]
    },
    {
      title: 'Lamination & Trimming Checklist',
      department: 'Production',
      description: 'Quality control checklist for lamination and trimming process',
      instructions: 'Complete each step in order. All items must be checked before proceeding.',
      fields: [
        "CONFIRMED WHETHER LAMINATION IS NEEDED OR NOT, CHECK PRINT PAPERWORK",
        "Confirmed there is enough lamination to complete your project Or have a plan and keep a close eye on the lamination so you can change it in between panels if possible",
        "Load vinyl roll on proper bar depending on length of project Tap roll on ground to secure roll is even along edge. Lamination bar further under should be used for long runs",
        "Attached take up real for long runs or if you are laminating alone",
        "Reviewed panels while lamination occurs for obvious issues",
        "Swiffered panels as they are being laminated to reduce lint, dirt ect.",
        "Confirmed panels that are laminated - if possible may need to occur during trim; CHECKLIST",
        "Trimmed panels leaving 5 inches at both ends of Print Cut files and removing excess lamination",
        "Trim panels that need to be sewn together and compare edges to confirm color matches",
        "Confirm COMPLETE panel inventory and package/cart project for installation; CHECKLIST"
      ]
    },
    {
      title: 'Plotting Tasks Checklist',
      department: 'Production',
      description: 'Quality control checklist for plotting process',
      instructions: 'Verify each step before proceeding. All items must be completed in sequence.',
      fields: [
        "In Onyx Cutter Control, Made sure that CutContour Layer is set to Manual/Device Settings",
        "Sent data from Print Computer to Plotter using Cutter Control",
        "Launched Barcode Server On Summa Cutter Control on plotter computer and made sure cut file was sent",
        "Confirmed Pinch Rollers were properly placed at the ends of vinyl with enough room between them and OPOS marks",
        "Confirmed vinyl is straight using lines on plotter (Run vinyl through plotter to check for skew on long runs)",
        "Ran pressure tests starting at 60 to determine proper pressure necessary to cut vinyl that was loaded",
        "Placed Cutting tool centered and approximately 1 inch under barcode",
        "Confirm COMPLETE plot inventory and package/cart project for installation; CHECKLIST"
      ]
    }
  ]

  // Create forms and templates
  for (const formTemplate of formTemplates) {
    // Find department
    const department = await prisma.department.findUnique({
      where: { name: formTemplate.department }
    })

    if (!department) {
      console.error(`Department ${formTemplate.department} not found`)
      continue
    }

    // Create form
    const form = await prisma.form.create({
      data: {
        title: formTemplate.title,
        description: formTemplate.description,
        instructions: formTemplate.instructions,
        department_id: department.department_id,
      }
    })

    // Create form template
    await prisma.formTemplate.create({
      data: {
        form_id: form.form_id,
        name: `${formTemplate.title} Template`,
        description: `Standard template for ${formTemplate.title}`,
        fields: {
          items: formTemplate.fields.map((text, index) => ({
            id: index + 1,
            type: 'checkbox',
            label: text,
            required: true
          }))
        },
        layout: {
          sections: [
            {
              title: 'Tasks',
              description: 'Complete all tasks in order',
              fields: formTemplate.fields.map((_, index) => index + 1)
            }
          ]
        },
        version: 1,
        is_active: true
      }
    })
  }

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