#!/bin/bash

echo "🔄 POST-ENVIRONMENT VARIABLES VERIFICATION"
echo "=========================================="
echo "📅 $(date)"
echo "🌐 Testing: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo ""

echo "⏳ Waiting for deployment to stabilize..."
sleep 5

echo ""
echo "🧪 QUICK HEALTH CHECK:"
echo "====================="

# Test status
echo "📊 API Status:"
status=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/status")
if echo "$status" | grep -q "healthy"; then
    echo "  ✅ API is running"
else
    echo "  ❌ API not responding"
    exit 1
fi

# Test auth configuration
echo ""
echo "🔐 Authentication Test:"
auth=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/auth-test")
nextauth_secret=$(echo "$auth" | grep -o '"NEXTAUTH_SECRET_EXISTS":[^,]*' | cut -d: -f2)
google_id=$(echo "$auth" | grep -o '"GOOGLE_CLIENT_ID_EXISTS":[^,]*' | cut -d: -f2)
database=$(echo "$auth" | grep -o '"DATABASE_URL_EXISTS":[^,]*' | cut -d: -f2)

if [[ $nextauth_secret == "true" ]]; then
    echo "  ✅ NEXTAUTH_SECRET: Set"
else
    echo "  ❌ NEXTAUTH_SECRET: Missing"
fi

if [[ $google_id == "true" ]]; then
    echo "  ✅ GOOGLE_CLIENT_ID: Set"
else
    echo "  ❌ GOOGLE_CLIENT_ID: Missing"
fi

if [[ $database == "true" ]]; then
    echo "  ✅ DATABASE_URL: Set"
else
    echo "  ❌ DATABASE_URL: Missing"
fi

# Test home page
echo ""
echo "🏠 Home Page Test:"
home_status=$(curl -s -o /dev/null -w "%{http_code}" "https://main.d1ec4l2vmh6hbe.amplifyapp.com")
if [[ $home_status == "200" ]]; then
    echo "  ✅ Home page loading (Status: $home_status)"
elif [[ $home_status == "307" ]]; then
    echo "  ⚠️  Still redirecting - environment variables may need time to propagate"
else
    echo "  ❌ Home page error (Status: $home_status)"
fi

# Test properties API
echo ""
echo "🏠 Properties API Test:"
properties=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/properties")
if echo "$properties" | grep -q '"properties"'; then
    properties_count=$(echo "$properties" | grep -o '"properties":\[[^]]*\]' | grep -o '\[.*\]' | jq '. | length' 2>/dev/null || echo "unknown")
    echo "  ✅ Properties API working (returned $properties_count properties)"
elif echo "$properties" | grep -q "error"; then
    echo "  ❌ Properties API error - check database connection"
else
    echo "  ⚠️  Properties API responding but format unclear"
fi

# Test AWS services
echo ""
echo "☁️  AWS Services Test:"
aws_health=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/aws-health")
if echo "$aws_health" | grep -q '"database":true'; then
    echo "  ✅ Database: Connected"
else
    echo "  ❌ Database: Not connected"
fi

if echo "$aws_health" | grep -q '"s3":true'; then
    echo "  ✅ S3: Configured"
else
    echo "  ❌ S3: Not configured"
fi

echo ""
echo "📊 FINAL VERDICT:"
echo "================"

# Count successful tests
success_count=0
total_tests=5

if echo "$status" | grep -q "healthy"; then ((success_count++)); fi
if [[ $nextauth_secret == "true" && $google_id == "true" && $database == "true" ]]; then ((success_count++)); fi
if [[ $home_status == "200" ]]; then ((success_count++)); fi
if echo "$properties" | grep -q '"properties"'; then ((success_count++)); fi
if echo "$aws_health" | grep -q '"database":true'; then ((success_count++)); fi

echo "✅ Passing tests: $success_count/$total_tests"

if [[ $success_count -eq $total_tests ]]; then
    echo "🎉 ALL TESTS PASSED! Your application is fully functional."
    echo ""
    echo "🚀 Ready for use:"
    echo "• Home: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
    echo "• Properties: https://main.d1ec4l2vmh6hbe.amplifyapp.com/properties"
    echo "• Authentication: Google OAuth should work"
    echo "• API: All endpoints operational"
elif [[ $success_count -ge 3 ]]; then
    echo "⚠️  MOSTLY WORKING - Some features may need additional configuration"
    echo "💡 Check the failed tests above for specific issues"
else
    echo "❌ MULTIPLE ISSUES - Environment variables may not be fully set"
    echo "🔄 Try running this test again in 2-3 minutes"
    echo "💡 Ensure all environment variables are correctly set in Amplify Console"
fi

echo ""
echo "🔗 Useful links:"
echo "• AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "• Environment Variables: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/settings/variables"
echo "• Build History: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/hosting"
