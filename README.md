# Enterprise Project Management System

A comprehensive project management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Project Management
- Create and manage projects with detailed information
- Track project status and progress
- Assign customers to projects
- Multiple project types support (Full Wrap, Partial, Decals, etc.)
- VIN and Invoice number tracking

### Forms System
- Dynamic form builder for creating custom forms
- Department-specific form templates
- Color-coded forms based on department
- Drag-and-drop form reordering
- Page number organization for forms
- Standardized form layouts with:
  - Color-coded headers
  - Project information section
  - Instructions
  - Task checklists

### Workflow Management
- Create and track workflow tasks
- Associate forms with workflow steps
- Track task dependencies and progress
- Status updates and notifications

## Technical Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: Shadcn/ui
- **Form Handling**: React Hook Form, Zod
- **Database**: Prisma ORM
- **State Management**: React Context
- **Styling**: TailwindCSS, CSS Modules

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── forms/            # Forms pages
│   └── projects/         # Project pages
├── components/            # React components
│   ├── forms/            # Form components
│   ├── projects/         # Project components
│   └── ui/               # UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Recent Updates

### Form System and Project Traveler Enhancements (Latest)
- Fixed type safety in project form with proper TypeScript types
- Enhanced checkbox handling in project type selection
- Improved form field validation and type checking
- Integrated project information directly into Print/Panel checklist
- Streamlined traveler page layout for better usability
- Added proper type assertions for form field names
- Enhanced project type selection with const assertions
- Improved boolean value handling in checkboxes

### Form System Enhancements
- Added customer selection to project creation form
- Improved form validation and error handling
- Added loading states and better user feedback
- Fixed controlled/uncontrolled input issues
- Enhanced error messages and toast notifications

### Project Management
- Implemented project type selection with checkboxes
- Added VIN and invoice number tracking
- Improved project creation workflow
- Enhanced customer association

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Add JSDoc comments for all components and functions
- Use early returns for better readability

### Components
- Create reusable components
- Implement proper prop validation
- Add accessibility features
- Use Tailwind for styling
- Follow naming conventions

### Documentation
- Update README with new features
- Add JSDoc comments
- Document API endpoints
- Include usage examples

## Contributing

1. Create a feature branch
2. Make changes
3. Add tests if applicable
4. Update documentation
5. Submit pull request
