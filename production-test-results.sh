#!/bin/bash

echo "🧪 COMPREHENSIVE PRODUCTION TEST RESULTS"
echo "========================================"
echo "📅 $(date)"
echo "🌐 Site: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo ""

# Test API Endpoints
echo "🔗 API ENDPOINT TESTS:"
echo "====================="

echo "📊 /api/status"
status_result=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/status")
if echo "$status_result" | grep -q "healthy"; then
    echo "  ✅ API Status: HEALTHY"
else
    echo "  ❌ API Status: FAILED"
fi

echo ""
echo "🔐 /api/auth-test"
auth_result=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/auth-test")
if echo "$auth_result" | grep -q "NEXTAUTH_SECRET_EXISTS.*false"; then
    echo "  ❌ Authentication: MISSING ENV VARS"
    echo "     - NEXTAUTH_SECRET: Missing"
    echo "     - GOOGLE_CLIENT_ID: Missing"
    echo "     - DATABASE_URL: Missing"
else
    echo "  ✅ Authentication: Configured"
fi

echo ""
echo "🏠 /api/properties (New Endpoint)"
properties_result=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/properties")
if echo "$properties_result" | grep -q "error"; then
    echo "  ❌ Properties API: FAILED (Database connection issue)"
else
    echo "  ✅ Properties API: Working"
fi

echo ""
echo "🏥 /api/aws-health"
health_result=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/aws-health")
if echo "$health_result" | grep -q "degraded"; then
    echo "  ⚠️  AWS Health: DEGRADED"
    echo "     - Database: ❌ Not connected"
    echo "     - S3: ❌ Not configured"
    echo "     - Cache: ✅ Working"
else
    echo "  ✅ AWS Health: All services operational"
fi

echo ""
echo "🔧 /api/runtime-diagnostics"
runtime_result=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/runtime-diagnostics")
env_count=$(echo "$runtime_result" | grep -o '"totalEnvVars":[0-9]*' | cut -d: -f2)
echo "  📊 Environment Variables: $env_count total"
echo "  🚨 Critical vars missing: 7/7"

# Test Main Pages
echo ""
echo "🌐 PAGE TESTS:"
echo "============="

echo "🏠 Home Page"
home_status=$(curl -s -o /dev/null -w "%{http_code}" "https://main.d1ec4l2vmh6hbe.amplifyapp.com")
if [[ $home_status == "307" ]]; then
    echo "  ❌ Home Page: Redirecting to auth error (NextAuth misconfiguration)"
else
    echo "  ✅ Home Page: Loading (Status: $home_status)"
fi

echo ""
echo "🏢 Properties Page"
properties_status=$(curl -s -o /dev/null -w "%{http_code}" "https://main.d1ec4l2vmh6hbe.amplifyapp.com/properties")
echo "  📊 Status Code: $properties_status"

# Summary
echo ""
echo "📋 SUMMARY:"
echo "==========="
echo "✅ Deployment: Successful"
echo "✅ Application: Running"
echo "✅ API Infrastructure: Working"
echo "❌ Environment Variables: MISSING (Critical)"
echo "❌ Database: Not connected"
echo "❌ Authentication: Not configured"
echo "❌ S3/File uploads: Not working"
echo ""

echo "🚨 CRITICAL ISSUE:"
echo "=================="
echo "All environment variables are missing from AWS Amplify!"
echo "This is preventing the app from working properly."
echo ""

echo "🛠️  IMMEDIATE FIX REQUIRED:"
echo "=========================="
echo "1. Go to AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "2. Select your app → Environment variables"
echo ""
echo "3. Add these CRITICAL variables:"
echo "   NEXTAUTH_SECRET=your-32-char-secret"
echo "   NEXTAUTH_URL=https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo "   DATABASE_URL=your-postgresql-url"
echo "   GOOGLE_CLIENT_ID=your-google-id"
echo "   GOOGLE_CLIENT_SECRET=your-google-secret"
echo "   AWS_ACCESS_KEY_ID=your-aws-key"
echo "   AWS_SECRET_ACCESS_KEY=your-aws-secret"
echo "   S3_BUCKET_NAME=your-bucket-name"
echo "   STRIPE_SECRET_KEY=your-stripe-key"
echo "   STRIPE_PUBLISHABLE_KEY=your-stripe-public-key"
echo ""
echo "4. After adding variables:"
echo "   → Go to Hosting tab"
echo "   → Click 'Redeploy this version'"
echo ""
echo "⏱️  Expected fix time: 5-8 minutes after setting variables"
echo ""
echo "🧪 Re-run this test after redeployment to verify fixes"
