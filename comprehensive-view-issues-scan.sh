#!/bin/bash

echo "🔍 Comprehensive View Issues Scan for Real Estate Platform"
echo "========================================================="

echo "📅 $(date)"
echo ""

# Check if server is running
if lsof -i :3002 > /dev/null 2>&1; then
    echo "✅ Dev server is running on port 3002"
else
    echo "❌ Dev server is not running on port 3002"
    echo "Starting dev server..."
    npm run dev &
    sleep 10
fi

echo ""
echo "🔍 1. SCANNING FOR VIEW ISSUES"
echo "================================"

# Test main pages
pages=(
    "http://localhost:3002"
    "http://localhost:3002/about"
    "http://localhost:3002/properties"
    "http://localhost:3002/contact"
    "http://localhost:3002/auth/signin"
    "http://localhost:3002/auth/signup"
    "http://localhost:3002/dashboard"
)

for page in "${pages[@]}"; do
    echo "🌐 Testing: $page"
    
    # Check if page loads without error
    response=$(curl -s -o /dev/null -w "%{http_code}" "$page" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        echo "  ✅ Status: $response (OK)"
    elif [ "$response" = "302" ] || [ "$response" = "307" ]; then
        echo "  🔄 Status: $response (Redirect - may be auth protected)"
    elif [ "$response" = "000" ]; then
        echo "  ❌ Status: Connection failed"
    else
        echo "  ⚠️  Status: $response"
    fi
    
    # Check for common errors in the response
    content=$(curl -s "$page" 2>/dev/null || echo "")
    
    if [[ "$content" == *"error"* ]] || [[ "$content" == *"Error"* ]]; then
        echo "  ⚠️  May contain error content"
    fi
    
    if [[ "$content" == *"404"* ]]; then
        echo "  ❌ Contains 404 content"
    fi
    
    if [[ "$content" == *"500"* ]]; then
        echo "  ❌ Contains 500 error content"
    fi
    
    echo ""
done

echo ""
echo "🔍 2. CHECKING API ENDPOINTS"
echo "============================"

api_endpoints=(
    "http://localhost:3002/api/status"
    "http://localhost:3002/api/auth-test"
    "http://localhost:3002/api/aws-health"
    "http://localhost:3002/api/runtime-diagnostics"
    "http://localhost:3002/api/properties"
)

for endpoint in "${api_endpoints[@]}"; do
    echo "🔌 Testing API: $endpoint"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        echo "  ✅ Status: $response (OK)"
        # Get a snippet of the response
        content=$(curl -s "$endpoint" 2>/dev/null | head -c 200)
        echo "  📄 Content preview: ${content:0:100}..."
    else
        echo "  ❌ Status: $response"
    fi
    echo ""
done

echo ""
echo "🔍 3. SCANNING CODE FOR COMMON VIEW ISSUES"
echo "=========================================="

echo "🔍 Checking for missing images/assets..."
grep -r "src=" src/ --include="*.tsx" --include="*.ts" | grep -v ".git" | head -10

echo ""
echo "🔍 Checking for hardcoded URLs..."
grep -r "http://localhost" src/ --include="*.tsx" --include="*.ts" | grep -v ".git" | head -10

echo ""
echo "🔍 Checking for console.error or console.warn..."
grep -r "console\." src/ --include="*.tsx" --include="*.ts" | grep -v ".git" | head -10

echo ""
echo "🔍 Checking for TODO/FIXME comments..."
grep -r "TODO\|FIXME\|HACK" src/ --include="*.tsx" --include="*.ts" | grep -v ".git" | head -10

echo ""
echo "🔍 Checking for potential CSS/styling issues..."
grep -r "className.*undefined\|className.*null" src/ --include="*.tsx" --include="*.ts" | head -5

echo ""
echo "🔍 Checking for missing alt tags on images..."
grep -r "<img" src/ --include="*.tsx" --include="*.ts" | grep -v "alt=" | head -5

echo ""
echo "🔍 4. CHECKING FOR RESPONSIVE DESIGN ISSUES"
echo "==========================================="

echo "🔍 Checking for fixed widths without responsive variants..."
grep -r "w-\[.*px\]\|h-\[.*px\]" src/ --include="*.tsx" --include="*.ts" | head -5

echo ""
echo "🔍 Checking for missing responsive classes..."
echo "Looking for components that may need responsive variants..."
grep -r "hidden\|block\|flex" src/ --include="*.tsx" --include="*.ts" | grep -v "sm:\|md:\|lg:\|xl:" | head -5

echo ""
echo "🔍 5. CHECKING FOR ACCESSIBILITY ISSUES"
echo "======================================="

echo "🔍 Checking for buttons without accessible labels..."
grep -r "<button" src/ --include="*.tsx" --include="*.ts" | grep -v "aria-label\|aria-labelledby" | head -5

echo ""
echo "🔍 Checking for missing form labels..."
grep -r "<input" src/ --include="*.tsx" --include="*.ts" | grep -v "aria-label\|aria-labelledby" | head -5

echo ""
echo "🔍 6. CHECKING FOR PERFORMANCE ISSUES"
echo "====================================="

echo "🔍 Checking for large bundle imports..."
grep -r "import.*from.*'[^/]" src/ --include="*.tsx" --include="*.ts" | grep -E "(lodash|moment|react-router)" | head -5

echo ""
echo "🔍 Checking for missing loading states..."
echo "Components that might need loading states:"
grep -r "fetch\|axios" src/ --include="*.tsx" --include="*.ts" | grep -v "loading\|Loading" | head -5

echo ""
echo "🔍 7. TESTING SPECIFIC PROPERTY PAGES"
echo "====================================="

# Test if we can get property IDs
echo "🏠 Testing property pages..."
property_response=$(curl -s "http://localhost:3002/api/properties" 2>/dev/null || echo "[]")

if [[ "$property_response" == *"id"* ]]; then
    echo "✅ Properties API returned data"
    # Try to extract first property ID (basic parsing)
    first_id=$(echo "$property_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ ! -z "$first_id" ]; then
        echo "🔍 Testing property page: http://localhost:3002/properties/$first_id"
        prop_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002/properties/$first_id" 2>/dev/null || echo "000")
        echo "  Status: $prop_response"
    fi
else
    echo "⚠️  Properties API may not be returning expected data"
fi

echo ""
echo "🔍 8. SUMMARY & RECOMMENDATIONS"
echo "==============================="

echo "✅ Scan completed. Key areas to check:"
echo "1. 🌐 Page loading status codes above"
echo "2. 🔌 API endpoint functionality"
echo "3. 🎨 CSS/styling consistency"
echo "4. 📱 Mobile responsiveness"
echo "5. ♿ Accessibility compliance"
echo "6. ⚡ Performance optimizations"
echo ""
echo "🔧 To fix issues, check the specific files mentioned above."
echo "💡 Consider running Lighthouse audit for comprehensive analysis."
echo ""
echo "📋 Next steps:"
echo "- Open http://localhost:3002 in browser for visual inspection"
echo "- Test on different screen sizes"
echo "- Check browser console for JavaScript errors"
echo "- Verify all interactive elements work properly"
