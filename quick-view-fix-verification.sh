#!/bin/bash

echo "🔧 Quick View Issues Fix Verification"
echo "=================================="
echo "📅 $(date)"
echo ""

# Test the properties API endpoint
echo "🧪 Testing /api/properties endpoint:"
response=$(curl -s "http://localhost:3002/api/properties?limit=1" 2>/dev/null)
if echo "$response" | grep -q '"properties"'; then
    echo "  ✅ Properties API endpoint working"
    count=$(echo "$response" | jq -r '.properties | length' 2>/dev/null || echo "0")
    echo "  📊 Returned $count properties"
else
    echo "  ❌ Properties API endpoint not working"
    echo "  Response: $response"
fi

echo ""

# Check if placeholder image exists
echo "🖼️  Checking placeholder image:"
if [[ -f "public/placeholder-property.svg" ]]; then
    echo "  ✅ Placeholder SVG exists"
else
    echo "  ❌ Placeholder SVG missing"
fi

echo ""

# Quick accessibility check
echo "♿ Quick accessibility check:"
echo "  🔍 Checking for aria-label on buttons..."
aria_labels=$(grep -r "aria-label" src/app/auth/ src/app/database/ 2>/dev/null | wc -l)
echo "  📊 Found $aria_labels aria-labels in auth and database pages"

echo ""

# Check for alt tags on images
echo "🖼️  Image alt tags check:"
missing_alt=$(grep -r "<img" src/app/ 2>/dev/null | grep -v "alt=" | wc -l)
if [[ $missing_alt -eq 0 ]]; then
    echo "  ✅ All images have alt tags"
else
    echo "  ⚠️  Found $missing_alt images potentially missing alt tags"
fi

echo ""

# Test main pages
echo "🌐 Testing main pages:"
pages=(
    "http://localhost:3002"
    "http://localhost:3002/properties"
    "http://localhost:3002/api/status"
    "http://localhost:3002/api/properties"
    "http://localhost:3002/api/auth-test"
)

for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$page" 2>/dev/null || echo "000")
    if [[ $status == "200" ]]; then
        echo "  ✅ $page (Status: $status)"
    else
        echo "  ❌ $page (Status: $status)"
    fi
done

echo ""

# Check for console errors in the output
echo "🔍 Quick code quality check:"
tsx_errors=$(find src/ -name "*.tsx" -exec grep -l "console.error\|TODO\|FIXME" {} \; 2>/dev/null | wc -l)
echo "  📊 Files with console.error/TODO/FIXME: $tsx_errors"

echo ""

# Performance check
echo "⚡ Performance indicators:"
if command -v du >/dev/null; then
    node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "  📦 node_modules size: $node_modules_size"
fi

if [[ -d ".next" ]]; then
    next_size=$(du -sh .next 2>/dev/null | cut -f1)
    echo "  🏗️  .next build size: $next_size"
fi

echo ""
echo "✅ View issues scan completed!"
echo "💡 If all tests pass, the main view issues have been fixed."
