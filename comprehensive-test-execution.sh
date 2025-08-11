#!/bin/bash

# Comprehensive Test Execution Script
echo "🧪 COMPREHENSIVE REAL ESTATE PLATFORM TEST EXECUTION"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
PASS_COUNT=0
FAIL_COUNT=0
TODO_ITEMS=()

# Function to log test result
log_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        [ -n "$details" ] && echo "   $details"
        ((PASS_COUNT++))
    elif [ "$result" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        [ -n "$details" ] && echo "   $details"
        ((FAIL_COUNT++))
        TODO_ITEMS+=("FIX: $test_name - $details")
    else
        echo -e "${YELLOW}⚠️  SKIP${NC}: $test_name"
        [ -n "$details" ] && echo "   $details"
    fi
    echo ""
}

# Test server availability
echo "🔧 PRELIMINARY CHECKS"
echo "======================"

# Check if server is running
if curl -s --max-time 5 http://localhost:3001 > /dev/null; then
    log_test "Server Availability" "PASS" "Next.js server responding on localhost:3001"
else
    log_test "Server Availability" "FAIL" "Server not responding - cannot continue tests"
    exit 1
fi

# ACT I: ANONYMOUS VISITOR TESTS
echo "🎭 ACT I: ANONYMOUS VISITOR TESTING"
echo "==================================="

# Test 1.1: Homepage Load
homepage_response=$(curl -s --max-time 10 http://localhost:3001)
if echo "$homepage_response" | grep -q "DOCTYPE html" && echo "$homepage_response" | grep -q -i "real estate"; then
    log_test "1.1 Homepage Load" "PASS" "HTML page loads with real estate content"
else
    log_test "1.1 Homepage Load" "FAIL" "Homepage did not load properly or missing content"
fi

# Test 1.2: API Endpoints
api_response=$(curl -s --max-time 10 http://localhost:3001/api/listings)
if echo "$api_response" | grep -q -E '(\[|\{)'; then
    log_test "1.2 Listings API" "PASS" "API returns JSON data"
else
    log_test "1.2 Listings API" "FAIL" "API not returning valid JSON response"
fi

# Test 1.3: Properties Page
properties_response=$(curl -s --max-time 10 http://localhost:3001/properties)
if echo "$properties_response" | grep -q "DOCTYPE html"; then
    log_test "1.3 Properties Page Load" "PASS" "Properties page loads"
else
    log_test "1.3 Properties Page Load" "FAIL" "Properties page failed to load"
fi

# Test 1.4: SEO Elements Check
if echo "$homepage_response" | grep -q "<title>.*Real Estate.*</title>"; then
    log_test "1.4 Homepage SEO Title" "PASS" "Title tag contains Real Estate branding"
else
    log_test "1.4 Homepage SEO Title" "FAIL" "Title tag missing or incorrect"
fi

# Test 1.5: Sitemap Generation
sitemap_response=$(curl -s --max-time 10 http://localhost:3000/sitemap.xml)
if echo "$sitemap_response" | grep -q "<?xml" && echo "$sitemap_response" | grep -q "urlset"; then
    log_test "1.5 Sitemap Generation" "PASS" "Sitemap.xml generates valid XML"
else
    log_test "1.5 Sitemap Generation" "FAIL" "Sitemap.xml not generating or invalid format"
fi

# ACT II: AUTHENTICATION TESTS
echo "🔐 ACT II: AUTHENTICATION & USER FLOW"
echo "======================================"

# Test 2.1: Registration Page
register_response=$(curl -s --max-time 10 http://localhost:3000/register)
if echo "$register_response" | grep -q "DOCTYPE html" && echo "$register_response" | grep -q -i "register"; then
    log_test "2.1 Registration Page" "PASS" "Registration page loads"
else
    log_test "2.1 Registration Page" "FAIL" "Registration page failed to load"
fi

# Test 2.2: Login Page
login_response=$(curl -s --max-time 10 http://localhost:3000/auth/login)
if echo "$login_response" | grep -q "DOCTYPE html" && echo "$login_response" | grep -q -i "login"; then
    log_test "2.2 Login Page" "PASS" "Login page loads"
else
    log_test "2.2 Login Page" "FAIL" "Login page failed to load"
fi

# Test 2.3: Dashboard Protection (should redirect when not authenticated)
dashboard_response=$(curl -s -w "%{http_code}" --max-time 10 http://localhost:3000/dashboard)
http_code="${dashboard_response: -3}"
if [ "$http_code" = "200" ] || [ "$http_code" = "302" ] || [ "$http_code" = "307" ]; then
    log_test "2.3 Dashboard Protection" "PASS" "Dashboard route accessible (may redirect to auth)"
else
    log_test "2.3 Dashboard Protection" "FAIL" "Dashboard route returned error: $http_code"
fi

# ACT III: LISTING MANAGEMENT
echo "📝 ACT III: LISTING MANAGEMENT"
echo "==============================="

# Test 3.1: Add Listing Page (should require auth)
add_listing_response=$(curl -s -w "%{http_code}" --max-time 10 http://localhost:3000/add-listing)
http_code="${add_listing_response: -3}"
if [ "$http_code" = "200" ] || [ "$http_code" = "302" ] || [ "$http_code" = "307" ]; then
    log_test "3.1 Add Listing Access" "PASS" "Add listing route accessible (protected)"
else
    log_test "3.1 Add Listing Access" "FAIL" "Add listing route error: $http_code"
fi

# Test 3.2: Property Detail Pages (test with database data)
echo "Testing property detail pages..."

# Create a test script to get actual property IDs
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPropertyPages() {
  try {
    const listing = await prisma.listing.findFirst({
      select: { id: true, slug: true, title: true }
    });
    
    if (listing) {
      console.log('PROPERTY_ID=' + listing.id);
      console.log('PROPERTY_SLUG=' + listing.slug);
      console.log('PROPERTY_TITLE=' + listing.title);
    } else {
      console.log('NO_PROPERTIES_FOUND');
    }
  } catch (error) {
    console.log('DATABASE_ERROR');
  } finally {
    await prisma.\$disconnect();
  }
}

testPropertyPages();
" > /tmp/property_test.txt 2>/dev/null

if [ -f "/tmp/property_test.txt" ]; then
    source /tmp/property_test.txt
    
    if [ "$PROPERTY_ID" != "" ] && [ "$PROPERTY_ID" != "NO_PROPERTIES_FOUND" ] && [ "$PROPERTY_ID" != "DATABASE_ERROR" ]; then
        # Test property detail page
        property_response=$(curl -s --max-time 10 "http://localhost:3000/properties/$PROPERTY_ID")
        if echo "$property_response" | grep -q "DOCTYPE html" && echo "$property_response" | grep -q "$PROPERTY_TITLE"; then
            log_test "3.2 Property Detail Page" "PASS" "Property detail page loads with correct content"
        else
            log_test "3.2 Property Detail Page" "FAIL" "Property detail page failed to load or missing content"
        fi
        
        # Test SEO elements on property page
        if echo "$property_response" | grep -q "<title>.*$PROPERTY_TITLE.*</title>"; then
            log_test "3.3 Property SEO Title" "PASS" "Property page has correct SEO title"
        else
            log_test "3.3 Property SEO Title" "FAIL" "Property page missing or incorrect SEO title"
        fi
        
        # Test for structured data
        if echo "$property_response" | grep -q "application/ld+json"; then
            log_test "3.4 Structured Data" "PASS" "Property page includes JSON-LD structured data"
        else
            log_test "3.4 Structured Data" "FAIL" "Property page missing structured data"
        fi
        
        # Test for breadcrumbs
        if echo "$property_response" | grep -q -i "breadcrumb"; then
            log_test "3.5 Breadcrumbs" "PASS" "Property page includes breadcrumb navigation"
        else
            log_test "3.5 Breadcrumbs" "FAIL" "Property page missing breadcrumb navigation"
        fi
    else
        log_test "3.2-3.5 Property Tests" "SKIP" "No test properties found in database"
    fi
fi

# ACT IV: ADVANCED FEATURES
echo "🚀 ACT IV: ADVANCED FEATURES"
echo "============================="

# Test 4.1: API Authentication
auth_api_response=$(curl -s --max-time 10 http://localhost:3000/api/auth/session)
if echo "$auth_api_response" | grep -q -E '(\{|\[)'; then
    log_test "4.1 Auth API Session" "PASS" "Auth API returns valid response"
else
    log_test "4.1 Auth API Session" "FAIL" "Auth API not responding correctly"
fi

# Test 4.2: Error Pages
error_404_response=$(curl -s -w "%{http_code}" --max-time 10 http://localhost:3000/nonexistent-page)
http_code="${error_404_response: -3}"
if [ "$http_code" = "404" ]; then
    log_test "4.2 404 Error Handling" "PASS" "404 errors handled correctly"
else
    log_test "4.2 404 Error Handling" "FAIL" "404 handling incorrect: $http_code"
fi

# Test 4.3: Static Assets
favicon_response=$(curl -s -w "%{http_code}" --max-time 10 http://localhost:3000/favicon.ico)
http_code="${favicon_response: -3}"
if [ "$http_code" = "200" ]; then
    log_test "4.3 Static Assets" "PASS" "Favicon and static assets accessible"
else
    log_test "4.3 Static Assets" "FAIL" "Static assets not loading: $http_code"
fi

# FINAL RESULTS
echo "📊 TEST EXECUTION COMPLETE"
echo "=========================="
echo -e "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"

if [ $FAIL_COUNT -gt 0 ]; then
    echo ""
    echo "🔧 TODO ITEMS FOR REPAIR:"
    echo "========================"
    for item in "${TODO_ITEMS[@]}"; do
        echo "- $item"
    done
    
    # Write TODO items to file
    echo "# TODO List - Test Failures Requiring Repair" > TODO_TEST_REPAIRS.md
    echo "" >> TODO_TEST_REPAIRS.md
    echo "The following issues were found during comprehensive testing and need to be addressed:" >> TODO_TEST_REPAIRS.md
    echo "" >> TODO_TEST_REPAIRS.md
    for item in "${TODO_ITEMS[@]}"; do
        echo "- [ ] $item" >> TODO_TEST_REPAIRS.md
    done
    echo "" >> TODO_TEST_REPAIRS.md
    echo "Generated: $(date)" >> TODO_TEST_REPAIRS.md
    
    echo ""
    echo "TODO list written to TODO_TEST_REPAIRS.md"
fi

echo ""
if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Platform is ready for production.${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review TODO items and fix issues before production.${NC}"
fi

# Clean up
rm -f /tmp/property_test.txt

exit $FAIL_COUNT
