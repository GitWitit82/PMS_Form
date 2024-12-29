#!/bin/bash

# Check if project name is provided
if [ -z "$1" ]
then
    echo "Please provide a project name"
    echo "Usage: ./setup.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1

# Create new project directory
echo "Creating new project: $PROJECT_NAME"
cp -r . ../$PROJECT_NAME
cd ../$PROJECT_NAME

# Remove setup script and git
rm setup.sh
rm -rf .git

# Initialize new git repository
git init

# Update package.json
sed -i '' "s/shad-base/$PROJECT_NAME/g" package.json

# Install dependencies
echo "Installing dependencies..."
npm install

# Setup environment variables
echo "Setting up environment variables..."
cp .env.example .env

# Initialize database
echo "Setting up database..."
npx prisma generate
npx prisma migrate reset --force

echo "Setup complete! Your new project is ready."
echo "Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Run 'npm run dev' to start the development server" 