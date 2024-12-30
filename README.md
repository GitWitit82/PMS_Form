# Enterprise Project Management System

A comprehensive project management system built with Next.js, featuring workflow management, form handling, and project tracking capabilities.

## Features

### Project Management
- Project creation and tracking
- Resource allocation
- Task management
- Project status monitoring

### Workflow Management
- Customizable workflow templates
- Task dependencies
- Stage-based progression
- Visual workflow representation

### Forms System
- Dynamic form builder interface
- Department-specific form templates
- Multiple field types support:
  - Text input
  - Text area
  - Checkbox
  - Select dropdown
- Form preview functionality
- Project information integration
- Customizable layouts
- Department-specific styling

### User Management
- Role-based access control
- User authentication
- Profile management

## Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **Notifications**: Sonner Toast

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── forms/             # Form-related pages
│   │   ├── builder/       # Form builder interface
│   │   └── [id]/         # Dynamic form pages
│   └── workflows/         # Workflow pages
├── components/            # React components
│   ├── forms/            # Form components
│   │   ├── form-builder.tsx    # Form builder component
│   │   ├── form-layout.tsx     # Form layout component
│   │   └── form-header.tsx     # Form header component
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── prisma/              # Database schema and migrations
└── providers/           # Context providers
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
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Recent Updates

### Form Builder System (Latest)
- Implemented dynamic form builder interface
- Added support for multiple field types
- Created reusable form layout components
- Added department-specific styling
- Integrated form preview functionality
- Added form creation workflow with notifications

### Standard Workflow Implementation
- Added standard workflow templates
- Implemented workflow task management
- Created workflow visualization components
- Added stage-based progression tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
