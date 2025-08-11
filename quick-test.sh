#!/bin/bash

# Quick Test Script for Port 3001
echo "🧪 QUICK TEST EXECUTION - PORT 3001"
echo "==================================="

# Test server response
echo "1. Testing server availability..."
if curl -s --max-time 10 http://localhost:3001 > /dev/null; then
    echo "   ✅ Server responding on localhost:3001"
else
    echo "   ❌ Server not responding"
    exit 1
fi

# Test homepage
echo "2. Testing homepage content..."
homepage_content=$(curl -s --max-time 10 http://localhost:3001)
if echo "$homepage_content" | grep -q "html"; then
    echo "   ✅ Homepage returns HTML content"
    if echo "$homepage_content" | grep -q -i "real estate\|property\|dashboard"; then
        echo "   ✅ Homepage contains real estate content"
    else
        echo "   ⚠️  Homepage HTML loaded but may not contain expected content"
    fi
else
    echo "   ❌ Homepage not returning HTML"
fi

# Test API
echo "3. Testing API endpoints..."
api_response=$(curl -s --max-time 10 http://localhost:3001/api/auth/session)
if echo "$api_response" | grep -q -E '(\{|\[)'; then
    echo "   ✅ API returning JSON responses"
else
    echo "   ❌ API not returning JSON"
fi

# Test key routes
echo "4. Testing key routes..."
routes=("/register" "/auth/login" "/properties")
for route in "${routes[@]}"; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:3001$route")
    if [ "$status_code" = "200" ] || [ "$status_code" = "302" ] || [ "$status_code" = "307" ]; then
        echo "   ✅ Route $route: Status $status_code"
    else
        echo "   ❌ Route $route: Status $status_code"
    fi
done

echo ""
echo "🎯 Quick test complete! Server is operational on port 3001."
