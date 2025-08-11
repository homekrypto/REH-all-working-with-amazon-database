#!/bin/bash

echo "🚀 Quick Server Start"
echo "===================="

# Kill existing processes
echo "Stopping any running servers..."
pkill -f node 2>/dev/null
pkill -f tsx 2>/dev/null
sleep 2

# Clean ports
lsof -ti:5544 2>/dev/null | xargs kill -9 2>/dev/null

echo "Starting server on port 5544..."
echo "Open http://localhost:5544 in your browser"
echo ""

# Try standard Next.js first (simpler)
echo "Attempting standard Next.js dev server..."
npx next dev -p 5544

# If that fails, try custom server
if [ $? -ne 0 ]; then
    echo "Standard server failed. Trying custom server..."
    npm run dev
fi
