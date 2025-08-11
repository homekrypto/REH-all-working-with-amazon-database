#!/bin/bash

echo "🚀 Simple Server Startup"
echo "========================"

# Clean up ports
echo "Cleaning up ports..."
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:5544 2>/dev/null | xargs kill -9 2>/dev/null

echo "Choose startup method:"
echo "1. Custom server (recommended)"
echo "2. Standard Next.js dev server"
echo "3. Check for errors only"

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Starting custom server on port 5544..."
        npm run dev
        ;;
    2)
        echo "Starting standard Next.js server on port 5544..."
        npx next dev -p 5544
        ;;
    3)
        echo "Checking for compilation errors..."
        npx tsc --noEmit
        npx next build --dry-run
        ;;
    *)
        echo "Invalid choice. Starting custom server..."
        npm run dev
        ;;
esac
