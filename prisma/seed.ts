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

  // Create departments
  const departments = [
    { department_id: 1, name: 'Marketing', description: 'Handles creative concepts and marketing strategies', color: '#2563eb' },
    { department_id: 2, name: 'Project Mgmt', description: 'Manages project workflow and client communication', color: '#16a34a' },
    { department_id: 3, name: 'Design', description: 'Creates designs and handles artwork production', color: '#9333ea' },
    { department_id: 4, name: 'All Departments', description: 'Tasks that require collaboration across departments', color: '#dc2626' },
    { department_id: 5, name: 'Finance', description: 'Handles invoicing and financial tracking', color: '#ca8a04' },
    { department_id: 6, name: 'Installation', description: 'Performs physical installation of products', color: '#0891b2' },
    { department_id: 7, name: 'Production', description: 'Handles manufacturing and production processes', color: '#be185d' },
    { department_id: 8, name: 'Prep', description: 'Prepares surfaces and materials for installation', color: '#ea580c' }
  ]

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { department_id: dept.department_id },
      update: dept,
      create: dept
    })
  }

  console.log('Created departments')

  // Create forms
  const forms = [
    {
      form_id: 1,
      title: 'Graphic Design Checklist',
      department_id: 3, // Design department
      description: 'Checklist for graphic design process',
      type: 'CHECKLIST',
      page: 1
    },
    {
      form_id: 2,
      title: 'Paneling & Prepress Checklist',
      department_id: 7, // Production department
      description: 'Checklist for paneling and prepress process',
      type: 'CHECKLIST',
      page: 2
    },
    {
      form_id: 3,
      title: 'Print Checklist',
      department_id: 7, // Production department
      description: 'Checklist for printing process',
      type: 'CHECKLIST',
      page: 3
    },
    {
      form_id: 4,
      title: 'Lamination & Trimming Checklist',
      department_id: 7, // Production department
      description: 'Checklist for lamination and trimming process',
      type: 'CHECKLIST',
      page: 4
    },
    {
      form_id: 5,
      title: 'Plotting Tasks Checklist',
      department_id: 7, // Production department
      description: 'Checklist for plotting process',
      type: 'CHECKLIST',
      page: 5
    }
  ]

  for (const form of forms) {
    await prisma.form.upsert({
      where: { form_id: form.form_id },
      update: form,
      create: form
    })
  }

  console.log('Created forms')

  // Create form templates
  const formTemplates = [
    {
      template_id: 1,
      form_id: 1,
      name: 'Graphic Design Checklist Template',
      description: 'Standard checklist for graphic design process',
      fields: {
        items: [
          "Art Direction Form Completed",
          "Rough Mock-up Designed & saved to Design In Progress folder",
          "Rough Mock-up sent to Art Director for Approval", 
          "Design sent to customer via GoProof using Proof Sheet",
          "ROUGH MOCK APPROVED BY CLIENT",
          "Pre-design layout meeting had with departments to review vehicle",
          "Template Downloaded from 'TheBadWrap.com' or created from photos - Color Profile: sRGB IEC61966-2.1",
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
      layout: {
        type: 'checklist',
        columns: ['Task', 'Status', 'Notes']
      },
      version: 1,
      is_active: true
    },
    {
      template_id: 2,
      form_id: 2,
      name: 'Paneling & Prepress Checklist Template',
      description: 'Standard checklist for paneling and prepress process',
      fields: {
        items: [
          "Confirmed previous departments paperwork is signed off",
          "Printed approval and final files compared (must be the same)", 
          "Confirmed template verification was completed. Checked Non-wrapable areas",
          "Confirmed proper file settings",
          "Confirmed text has been converted to shape or has anti-aliasing on and is made into smart object",
          "Confirmed proper blue prints/mechanicals/cut graphics form/proofs/photos attached",
          "Confirmed the necessary bleed was added",
          "Spell Check / Contact Info Check Completed",
          "Panels for each side MUST be paneled from final design for THAT side, even if the 'same'",
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
      layout: {
        type: 'checklist',
        columns: ['Task', 'Status', 'Notes']
      },
      version: 1,
      is_active: true
    },
    {
      template_id: 3,
      form_id: 3,
      name: 'Print Checklist Template',
      description: 'Standard checklist for printing process',
      fields: {
        items: [
          "CONFIRMED PRINTER IS UP TO DATE WITH PREVENTATIVE MAINTENANCE",
          "Performed a Full Print Optimization Process",
          "Confirmed that 'space between print' settings in ONYX is .5' for standard; 2.5-3' for cut graphics using plotter",
          "Confirmed that substrate in printer matches job requirements for the project",
          "Confirmed that printer has enough substrate as required for what you just loaded to print. (Add a 5 foot buffer to the requirement be sure you have enough vinyl)",
          "Confirmed that take up roll is attached to vinyl in printer (or a plan for catching vinyl is set)",
          "Confirmed that substrate in printer was advanced if needed for tape marks and/or damaged areas to clear the final printing area",
          "Confirmed that all panels being printed have been TURNED and EXPANDED to ACTUAL PRINT SIZE",
          "Confirmed wrap panels with white backgrounds have crop marks/frame to aid in cutting",
          "Confirm edge clips are in proper position",
          "Confirmed that if multiple PRINT CUTS jobs are being printed, 'conserve media' is NOT selected and they are printed as individual jobs with their own barcodes.",
          "Confirmed that all ink levels in printer are ready to print. MUST BE IN THE SHOP to change inks if any color is less than 10% full or a solid color is being printed.",
          "Changed Ink Cartridges below 10%, if necessary, when setting up printer for overnight printing",
          "Confirmed gutter is included in print MUST GET SIGN OFF TO NOT INCLUDE",
          "Print Test Prints: To test photo quality and colors MUST GET SIGNED; View outside (samples must show key areas; solid, logo, image etc.) Ideal sizes: 5'x 26'or 5' x 52' stripes",
          "Before photo printed for rolling wall",
          "Compared Printed Color to Paint Wrap if color Paint Wrap is being used.",
          "If Wrap is from a Fleet (see check box at top of page) Compared Printed Sample to Past Printed Sample/photo(s)",
          "Vinyl usage under 85% must be discussed",
          "Printer must be watched while printing first panel and checked every 10 minutes to confirm no issues occur"
        ]
      },
      layout: {
        type: 'checklist',
        columns: ['Task', 'Status', 'Notes']
      },
      version: 1,
      is_active: true
    },
    {
      template_id: 4,
      form_id: 4,
      name: 'Lamination & Trimming Checklist Template',
      description: 'Standard checklist for lamination and trimming process',
      fields: {
        items: [
          "CONFIRMED WHETHER LAMINATION IS NEEDED OR NOT, CHECK PRINT PAPERWORK",
          "Confirmed there is enough lamination to complete your project Or have a plan and keep a close eye on the lamination so you can change it in between panels if possible",
          "Load vinyl roll on proper bar depending on length of project Tap roll on ground to secure roll is even along edge. Lamination bar further under should be used for long runs",
          "Attached take up real for long runs or if you are laminating alone",
          "Reviewed panels while lamination occurs for obvious issues",
          "Swiffered panels as they are being laminated to reduce lint, dirt ect.",
          "Confirmed panels that are laminated - if possible may need to occur during trim; CHECKLIST",
          "Trimmed panels leaving 5\" at both ends of Print Cut files and removing excess lamination!",
          "Trim panels that need to be sewn together and compare edges to confirm color matches",
          "Confirm COMPLETE panel inventory and package/cart project for installation; CHECKLIST"
        ]
      },
      layout: {
        type: 'checklist',
        columns: ['Task', 'Status', 'Notes']
      },
      version: 1,
      is_active: true
    },
    {
      template_id: 5,
      form_id: 5,
      name: 'Plotting Tasks Checklist Template',
      description: 'Standard checklist for plotting process',
      fields: {
        items: [
          "In Onyx Cutter Control, Made sure that CutContour Layer is set to 'Manual/Device Settings'",
          "Sent data from Print Computer to Plotter using Cutter Control",
          "Launched Barcode Server On Summa Cutter Control on plotter computer and made sure cut file was sent",
          "Confirmed Pinch Rollers were properly placed at the ends of vinyl with enough room between them and OPOS marks",
          "Confirmed vinyl is straight using lines on plotter (Run vinyl through plotter to check for skew on long runs)",
          "Ran pressure tests starting at 60 to determine proper pressure necessary to cut vinyl that was loaded",
          "Placed Cutting tool centered and approximately 1 inch under barcode",
          "Confirm COMPLETE plot inventory and package/cart project for installation; CHECKLIST"
        ]
      },
      layout: {
        type: 'checklist',
        columns: ['Task', 'Status', 'Notes']
      },
      version: 1,
      is_active: true
    }
  ]

  for (const template of formTemplates) {
    await prisma.formTemplate.upsert({
      where: { template_id: template.template_id },
      update: template,
      create: template
    })
  }

  console.log('Created form templates')

  // Create customers
  const customers = [
    { customer_id: 1, name: 'Acme Corporation', email: 'contact@acmecorp.com', phone: '555-0123' },
    { customer_id: 2, name: 'Pacific Northwest Motors', email: 'fleet@pnwmotors.com', phone: '555-0124' },
    { customer_id: 3, name: 'Downtown Retail Group', email: 'signs@drg.com', phone: '555-0125' },
    { customer_id: 4, name: 'Fresh Foods Market', email: 'marketing@freshfoods.com', phone: '555-0126' },
    { customer_id: 5, name: 'Tech Solutions Inc', email: 'branding@techsolutions.com', phone: '555-0127' },
    { customer_id: 6, name: 'City Transit Authority', email: 'fleet.graphics@citytransit.org', phone: '555-0128' },
    { customer_id: 7, name: 'Mountain Brewery Co', email: 'design@mountainbrew.com', phone: '555-0129' }
  ]

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { customer_id: customer.customer_id },
      update: customer,
      create: customer
    })
  }

  console.log('Created customers')

  // Create workflow
  const workflow = await prisma.workflow.upsert({
    where: { workflow_id: 1 },
    update: {},
    create: {
      workflow_id: 1,
      name: 'Standard',
      description: 'Standard workflow with body work and phase'
    }
  })

  console.log('Created workflow:', workflow)

  // Create workflow tasks
  const workflowTasks = [
    // Marketing Phase
    { workflow_id: 1, name: 'Creative Concept Meeting', description: 'Marketing', stage: 'Marketing', order: 1 },
    { workflow_id: 1, name: 'Follow up Email', description: 'Marketing', stage: 'Marketing', order: 2 },
    { workflow_id: 1, name: 'Rough Mock up', description: 'Marketing', stage: 'Marketing', order: 3 },
    { workflow_id: 1, name: 'Photos & Sizing', description: 'Marketing', stage: 'Marketing', order: 4 },
    { workflow_id: 1, name: 'Physical Inspection', description: 'Marketing', stage: 'Marketing', order: 5 },
    { workflow_id: 1, name: '$$$ Confirm and Update Invoice', description: 'Marketing', stage: 'Marketing', order: 6 },

    // Design Phase
    { workflow_id: 1, name: 'Pre-Design Layout Meeting', description: 'Graphic Design', stage: 'DESIGN', order: 7 },
    { workflow_id: 1, name: 'Create and verify Template', description: 'Graphic Design', stage: 'DESIGN', order: 8 },
    { workflow_id: 1, name: 'Start High Res Design', description: 'Graphic Design', stage: 'DESIGN', order: 9 },
    { workflow_id: 1, name: 'Art Direction Sign Off', description: 'Graphic Design', stage: 'DESIGN', order: 10 },
    { workflow_id: 1, name: 'Customer Sign Off', description: 'Graphic Design', stage: 'DESIGN', order: 11 },
    { workflow_id: 1, name: 'Final Design', description: 'Graphic Design', stage: 'DESIGN', order: 12 },
    { workflow_id: 1, name: 'Internal Proof', description: 'Graphic Design', stage: 'DESIGN', order: 13 },
    { workflow_id: 1, name: 'Art Direction Sign Off', description: 'Graphic Design', stage: 'DESIGN', order: 14 },
    { workflow_id: 1, name: 'Customer Sign Off', description: 'Graphic Design', stage: 'DESIGN', order: 15 },
    { workflow_id: 1, name: '$$$ Confirm Customer Deposit', description: 'Graphic Design', stage: 'DESIGN', order: 16 },
    { workflow_id: 1, name: 'Firm Hold Schedule Installation Drop Off', description: 'Graphic Design', stage: 'DESIGN', order: 17 },

    // Production Phase
    { workflow_id: 1, name: 'Order Raw Materials', description: 'PRODUCTION', stage: 'PRODUCTION', order: 18 },
    { workflow_id: 1, name: 'Make Installer Sheet', description: 'PRODUCTION', stage: 'PRODUCTION', order: 19 },
    { workflow_id: 1, name: 'Print Ready Files Blue Prints and Review', description: 'PRODUCTION', stage: 'PRODUCTION', order: 20 },
    { workflow_id: 1, name: 'Create Test Print', description: 'PRODUCTION', stage: 'PRODUCTION', order: 21 },
    { workflow_id: 1, name: 'Pre Install Meeting', description: 'PRODUCTION', stage: 'PRODUCTION', order: 22 },
    { workflow_id: 1, name: 'Paneling', description: 'PRODUCTION', stage: 'PRODUCTION', order: 23 },
    { workflow_id: 1, name: 'Printing', description: 'PRODUCTION', stage: 'PRODUCTION', order: 24 },
    { workflow_id: 1, name: 'Lamination & Rough QC', description: 'PRODUCTION', stage: 'PRODUCTION', order: 25 },
    { workflow_id: 1, name: 'Trim & Sew', description: 'PRODUCTION', stage: 'PRODUCTION', order: 26 },
    { workflow_id: 1, name: 'Plot', description: 'PRODUCTION', stage: 'PRODUCTION', order: 27 },
    { workflow_id: 1, name: 'Project Inventory Control / QC', description: 'PRODUCTION', stage: 'PRODUCTION', order: 28 },

    // Prep Phase
    { workflow_id: 1, name: 'Intake of Item', description: 'INSTALLATION', stage: 'PREP', order: 29 },
    { workflow_id: 1, name: 'Wrap Plan Set Up', description: 'INSTALLATION', stage: 'PREP', order: 30 },
    { workflow_id: 1, name: 'Repairs & Vinyl Adhesive Removal', description: 'INSTALLATION', stage: 'PREP', order: 31 },
    { workflow_id: 1, name: 'Prep Clean', description: 'INSTALLATION', stage: 'PREP', order: 32 },

    // Body Work Phase
    { workflow_id: 1, name: 'Putty', description: 'Body Work', stage: 'BODY WORK', order: 33 },
    { workflow_id: 1, name: 'Bondo', description: 'Body Work', stage: 'BODY WORK', order: 34 },
    { workflow_id: 1, name: 'Dent Removal', description: 'Body Work', stage: 'BODY WORK', order: 35 },
    { workflow_id: 1, name: 'Fabrication', description: 'Body Work', stage: 'BODY WORK', order: 36 },

    // Paint Phase
    { workflow_id: 1, name: 'Surface Prep / Degrease', description: 'Paint', stage: 'PAINT', order: 37 },
    { workflow_id: 1, name: 'Masking', description: 'Paint', stage: 'PAINT', order: 38 },
    { workflow_id: 1, name: 'Primer', description: 'Paint', stage: 'PAINT', order: 39 },
    { workflow_id: 1, name: 'Paint', description: 'Paint', stage: 'PAINT', order: 40 },
    { workflow_id: 1, name: 'Specialty Paint/ Texture/ Bedliner', description: 'Paint', stage: 'PAINT', order: 41 },
    { workflow_id: 1, name: 'Removal of Masking', description: 'Paint', stage: 'PAINT', order: 42 },

    // Installation Phase
    { workflow_id: 1, name: 'Dry Hang and Photos', description: 'INSTALLATION', stage: 'INSTALLATION', order: 43 },
    { workflow_id: 1, name: 'Install', description: 'INSTALLATION', stage: 'INSTALLATION', order: 44 },
    { workflow_id: 1, name: 'Post Wrap', description: 'INSTALLATION', stage: 'INSTALLATION', order: 45 },
    { workflow_id: 1, name: 'QC and Photos', description: 'INSTALLATION', stage: 'INSTALLATION', order: 46 },
    { workflow_id: 1, name: '$$$ Balance', description: 'INSTALLATION', stage: 'INSTALLATION', order: 47 },
    { workflow_id: 1, name: 'Reveal', description: 'INSTALLATION', stage: 'INSTALLATION', order: 48 },
    { workflow_id: 1, name: 'Debrief all Depts', description: 'INSTALLATION', stage: 'INSTALLATION', order: 49 },
    { workflow_id: 1, name: 'Close Project', description: 'INSTALLATION', stage: 'INSTALLATION', order: 50 }
  ]

  for (const task of workflowTasks) {
    await prisma.workflowTask.upsert({
      where: {
        workflow_task_id: task.order
      },
      update: {
        ...task,
        status: 'pending'
      },
      create: {
        ...task,
        workflow_task_id: task.order,
        status: 'pending'
      }
    })
  }

  console.log('Created workflow tasks')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 