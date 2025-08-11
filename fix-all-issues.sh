#!/bin/bash

echo "🚀 COMPREHENSIVE FIX SCRIPT FOR IMAGE UPLOAD SYSTEM"
echo "=================================================="
echo ""

# Step 1: Fix CORS
echo "📋 Step 1: Fix CORS Configuration"
echo "1. Open AWS S3 Console: https://s3.console.aws.amazon.com/"
echo "2. Find bucket: real-estate-hub"
echo "3. Go to Permissions > CORS"
echo "4. Replace with this configuration:"
echo ""
cat << 'EOF'
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["http://localhost:5544", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
EOF
echo ""
echo "5. Save the CORS configuration"
echo ""

# Step 2: Create test user
echo "📋 Step 2: Create Test User"
echo "Navigate to: http://localhost:5544/register"
echo "Register with:"
echo "  Email: me@p.pl"
echo "  Password: password123"
echo "  Role: Agent"
echo ""

# Step 3: Setup user permissions
echo "📋 Step 3: After registration, run this command:"
echo "node setup-test-user.js"
echo ""

# Step 4: Test the flow
echo "📋 Step 4: Test Image Upload Flow"
echo "1. Go to: http://localhost:5544/login"
echo "2. Login with: me@p.pl / password123"
echo "3. Go to: http://localhost:5544/add-listing"
echo "4. Try uploading images"
echo ""

echo "🎯 QUICK TEST COMMANDS:"
echo "======================="
echo ""
echo "# Test CORS:"
echo "curl -X OPTIONS http://localhost:5544/api/upload/request-upload-url \\"
echo "  -H 'Origin: http://localhost:5544' \\"
echo "  -H 'Access-Control-Request-Method: POST' \\"
echo "  -v"
echo ""
echo "# Test authentication after login:"
echo "curl -X GET http://localhost:5544/api/user/profile \\"
echo "  -H 'Cookie: your-session-cookie' \\"
echo "  -v"
echo ""

echo "✨ If you see CORS errors, make sure:"
echo "1. AWS S3 bucket name is: real-estate-hub"
echo "2. CORS policy allows localhost:5544"
echo "3. You're logged in as an agent"
echo ""

echo "🔧 Run this after completing the steps above:"
echo "./final-test.sh"
