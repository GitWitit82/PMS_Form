# Project Management System Template

A Next.js 14 project template with built-in user authentication, role management, and project tracking features.

## Features
- User authentication with PIN-based login
- Role-based access control (ADMIN, STAFF, PROJECT_MGT, CEO)
- Resource management
- Project tracking
- Task management
- Department organization
- Workflow management

## Quick Start

1. Create a new project using this template:
```bash
# Clone this repository
git clone https://github.com/gitwitit82/SI_Ware_fresh.git my-new-project

# Navigate to project directory
cd my-new-project

# Run the setup script
chmod +x setup.sh
./setup.sh my-new-project
```

2. Configure your environment:
```bash
# Copy the example environment file
cp .env.example .env

# Update the .env file with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

3. Initialize the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

## Default Admin Credentials
- Username: admin
- Email: admin@example.com
- PIN: 1234

## Database Schema
- Users (Authentication & Role Management)
- Resources (Team Members)
- Projects
- Tasks
- Departments
- Workflows
- WorkflowTasks

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npx prisma studio`: Open Prisma database UI
- `npx prisma migrate reset`: Reset database
- `npx prisma db seed`: Seed database

## Technology Stack
- Next.js 14
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- Tailwind CSS
- shadcn/ui

## Project Structure
```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── styles/             # Global styles
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT](LICENSE)
