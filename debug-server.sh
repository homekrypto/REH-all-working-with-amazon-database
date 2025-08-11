#!/bin/bash

echo "🔧 Real Estate Platform Debug Script"
echo "===================================="

# Check current directory
echo "📍 Current directory:"
pwd

# Check if we're in the right project
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "✅ Found package.json"

# Kill existing processes
echo "🔄 Killing existing Node.js processes..."
pkill -f "node.*server" 2>/dev/null || echo "No node server processes found"
pkill -f "tsx.*server" 2>/dev/null || echo "No tsx server processes found"
pkill -f "next.*dev" 2>/dev/null || echo "No next dev processes found"

# Check port usage
echo "🔍 Checking port usage..."
echo "Port 3000:"
lsof -i :3000 2>/dev/null || echo "  Port 3000 is free"
echo "Port 5544:"
lsof -i :5544 2>/dev/null || echo "  Port 5544 is free"

# Kill processes on ports if any
echo "🧹 Cleaning up ports..."
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || echo "  Port 3000 already clean"
lsof -ti:5544 2>/dev/null | xargs kill -9 2>/dev/null || echo "  Port 5544 already clean"

# Check Node.js and npm versions
echo "📋 Environment check:"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Installing dependencies..."
    npm install
else
    echo "✅ node_modules found"
fi

# Check Prisma
echo "🗄️  Checking database..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Prisma schema not found"
else
    echo "✅ Prisma schema found"
    echo "Generating Prisma client..."
    npx prisma generate
    echo "Pushing database schema..."
    npx prisma db push
fi

# Check TypeScript compilation
echo "🔧 Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Try to start the server
echo "🚀 Starting development server..."
echo "The server should be available at: http://localhost:5544"
echo "If you see 'Ready on http://0.0.0.0:5544', the server is working!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "Starting in 3 seconds..."
sleep 3

# Start the server
npm run dev
