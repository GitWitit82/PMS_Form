#!/bin/bash

echo "Cleaning up previous builds..."
killall node 2>/dev/null || true
rm -rf .next
rm -rf node_modules/.cache

echo "Starting development server..."
if [ -f ".env.development" ]; then
  echo "Using development environment..."
  export $(cat .env.development | xargs)
fi

npm run dev