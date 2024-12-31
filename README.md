# Enterprise Project Management System

A comprehensive project management system built with Next.js, TypeScript, and Prisma, featuring workflow management, form integration, and role-based access control.

## Features

### Workflow Management
- Task dependency management with support for various dependency types (Start-to-Start, Start-to-Finish, Finish-to-Start, Finish-to-Finish)
- Real-time progress tracking and status updates
- Estimated completion time calculation based on task durations and dependencies
- Visual progress indicators and dependency visualization

### Form System
- Dynamic form builder with customizable fields and layouts
- Department-specific form templates with custom colors
- Form versioning and template management
- Integration with workflow tasks and project management

### Project Management
- Resource scheduling and allocation
- Task assignment and tracking
- Project timeline visualization
- Status reporting and notifications

### Access Control
- Role-based access control (ADMIN, PROJECT_MGT, CEO)
- Department-specific permissions
- Secure authentication using NextAuth.js

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: Shadcn UI, TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Context and Hooks
- **API**: Next.js API Routes with REST endpoints

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   ├── forms/                  # Form pages
│   └── workflows/              # Workflow pages
├── components/
│   ├── forms/                  # Form components
│   ├── ui/                     # UI components
│   └── workflows/              # Workflow components
├── lib/                        # Utility functions
├── prisma/                     # Database schema and migrations
└── public/                     # Static assets
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Recent Updates

### Workflow System Enhancement
- Implemented task dependency management
- Added progress tracking and timeline estimation
- Created workflow progress visualization
- Integrated with form system for task completion

### Form System Updates
- Added department color customization
- Implemented form template versioning
- Created dynamic form builder
- Added form validation and error handling
- Enhanced Print/Panel Checklist with improved section management
- Optimized form layout and user interaction patterns
- Improved form component reusability and maintainability

## Contributing

1. Create a feature branch
2. Implement changes with proper documentation
3. Submit a pull request with a clear description
4. Ensure all tests pass and code meets standards

## Documentation

All components and functions are documented using JSDoc comments. Example:

```typescript
/**
 * WorkflowProgress Component
 * Displays and manages workflow progress, including task dependencies
 * @param {number} workflowId - The ID of the workflow
 * @param {Task[]} tasks - Array of workflow tasks
 * @param {Function} onTaskUpdate - Callback for task status updates
 */
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
