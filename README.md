# Enterprise Project Management System

A comprehensive project management system built with Next.js 14, featuring workflow automation, resource scheduling, and form management.

## Features

- 🔐 Multi-level Authentication & Authorization
- 📊 Project & Resource Management
- 🔄 Workflow Automation
- 📝 Dynamic Form System
- 📅 Resource Scheduling
- 📈 Progress Tracking
- 🎨 Theme Customization
- 🔍 Comprehensive Search
- 📱 Responsive Design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **UI Components:** shadcn/ui
- **Styling:** TailwindCSS
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form
- **Validation:** Zod
- **Charts:** Recharts (planned)

## Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd enterprise-project-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                      # Next.js 14 app directory
│   ├── api/                  # API routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/           # Dashboard pages
│   └── ...                  # Other app routes
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── forms/              # Form components
│   └── ...                 # Other components
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
├── providers/             # React context providers
├── prisma/                # Prisma schema and migrations
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:seed` - Seed the database

## Authentication

The system uses NextAuth.js with the following roles:
- Admin: Full system access
- Manager: Department and project management
- Supervisor: Project oversight and task management
- Staff: Task execution and form completion

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
