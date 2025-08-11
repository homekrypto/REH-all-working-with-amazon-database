#!/bin/bash

echo "🔍 Testing Real Estate Website..."
echo "================================"

# Test if server is running
echo "1. Testing server availability..."
if curl -s http://localhost:5544 >/dev/null; then
    echo "✅ Server is running on http://localhost:5544"
else
    echo "❌ Server is not responding"
    exit 1
fi

# Test homepage
echo "2. Testing homepage..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5544)
if [ "$response" = "200" ]; then
    echo "✅ Homepage loads successfully (HTTP $response)"
else
    echo "❌ Homepage failed to load (HTTP $response)"
fi

# Test register page
echo "3. Testing register page..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5544/register)
if [ "$response" = "200" ]; then
    echo "✅ Register page loads successfully (HTTP $response)"
else
    echo "❌ Register page failed to load (HTTP $response)"
fi

# Test database API
echo "4. Testing database API..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5544/api/database)
if [ "$response" = "200" ]; then
    echo "✅ Database API is working (HTTP $response)"
else
    echo "❌ Database API failed (HTTP $response)"
fi

# Test CSS file exists and is valid
echo "5. Testing CSS file..."
if [ -f "src/app/globals.css" ]; then
    lines=$(wc -l < src/app/globals.css)
    echo "✅ CSS file exists with $lines lines"
    
    # Check for oklch errors
    if grep -q "oklch" src/app/globals.css; then
        echo "⚠️  Warning: Found oklch() values in CSS (may cause errors)"
    else
        echo "✅ No problematic oklch() values found"
    fi
else
    echo "❌ CSS file not found"
fi

# Test database connection
echo "6. Testing database connection..."
if [ -f "db/custom.db" ]; then
    size=$(ls -lh db/custom.db | awk '{print $5}')
    echo "✅ Database file exists (size: $size)"
else
    echo "❌ Database file not found"
fi

echo ""
echo "🎉 Test completed!"
echo "Website is available at: http://localhost:5544"
echo "Database viewer at: http://localhost:5544/database"
echo "Prisma Studio at: http://localhost:5555"
