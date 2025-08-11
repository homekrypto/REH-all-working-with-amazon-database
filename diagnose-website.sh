#!/bin/bash

echo "🔍 WEBSITE DIAGNOSTIC SCRIPT"
echo "============================="

# Check working directory
echo "📁 Current Directory:"
pwd
echo ""

# Check if key files exist
echo "📋 Key Files Check:"
echo "✓ package.json exists: $([ -f package.json ] && echo "YES" || echo "NO")"
echo "✓ server.ts exists: $([ -f server.ts ] && echo "YES" || echo "NO")"
echo "✓ src/app exists: $([ -d src/app ] && echo "YES" || echo "NO")"
echo "✓ node_modules exists: $([ -d node_modules ] && echo "YES" || echo "NO")"
echo ""

# Check Node.js/npm
echo "🔧 Environment Check:"
echo "Node.js version: $(node --version 2>/dev/null || echo "NOT INSTALLED")"
echo "npm version: $(npm --version 2>/dev/null || echo "NOT INSTALLED")"
echo ""

# Check what's running on common ports
echo "🌐 Port Check:"
for port in 3000 3001 3002 3003 3004 5544; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "Port $port: OCCUPIED"
    else
        echo "Port $port: FREE"
    fi
done
echo ""

# Try starting the server
echo "🚀 Starting Server..."
echo "Attempting to start Next.js on port 3005..."

# Start in background and capture PID
npx next dev --port 3005 > server_output.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait a moment
sleep 5

# Check if server is responding
echo "Testing server response..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3005 | grep -q "200\|404\|302"; then
    echo "✅ Server is responding on http://localhost:3005"
    echo "🎉 Website is working!"
else
    echo "❌ Server not responding"
    echo "📄 Server output:"
    cat server_output.log 2>/dev/null || echo "No output available"
fi

echo ""
echo "🔍 To access the website, visit: http://localhost:3005"
