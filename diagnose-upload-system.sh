#!/bin/bash

echo "🔍 Complete Image Upload System Diagnosis"
echo "========================================="
echo ""

echo "📋 Checking Environment Configuration..."
echo ""

# Check if .env.local exists and has AWS creds
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    if grep -q "AWS_ACCESS_KEY_ID=AKIA" .env.local; then
        echo "✅ AWS credentials configured"
    else
        echo "❌ AWS credentials missing or invalid"
    fi
    
    if grep -q "AWS_S3_BUCKET_NAME=real-estate-images" .env.local; then
        echo "✅ Correct S3 bucket name configured"
    else
        echo "❌ S3 bucket name mismatch"
    fi
    
    if grep -q "AWS_REGION=eu-north-1" .env.local; then
        echo "✅ Correct AWS region configured"
    else
        echo "❌ AWS region mismatch"
    fi
else
    echo "❌ .env.local file missing"
fi

echo ""
echo "🌐 Testing API Endpoint..."

# Test if our upload URL endpoint works
API_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.jpg","filetype":"image/jpeg"}' \
  "http://localhost:5544/api/upload/request-upload-url")

if [ "$API_TEST" = "200" ]; then
    echo "✅ Upload URL API working"
else
    echo "❌ Upload URL API failed (HTTP $API_TEST)"
fi

echo ""
echo "☁️  Testing S3 CORS Configuration..."

CORS_TEST=$(curl -s -I \
  -H "Origin: http://localhost:5544" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type" \
  -X OPTIONS \
  "https://real-estate-images.s3.eu-north-1.amazonaws.com/" 2>/dev/null)

if echo "$CORS_TEST" | grep -q "access-control-allow-origin"; then
    echo "✅ S3 CORS policy working"
else
    echo "❌ S3 CORS policy NOT configured"
    echo ""
    echo "🚨 THIS IS THE ISSUE! Fix CORS policy in AWS Console:"
    echo "   1. https://s3.console.aws.amazon.com/"
    echo "   2. Bucket: real-estate-images"
    echo "   3. Permissions → CORS → Edit"
    echo "   4. Paste the JSON from fix-s3-cors.sh"
fi

echo ""
echo "📊 Summary:"
echo "==========="

if echo "$CORS_TEST" | grep -q "access-control-allow-origin"; then
    echo "🎉 System Status: READY FOR TESTING"
    echo "   → Go to http://localhost:5544/add-listing"
    echo "   → Upload images should work perfectly"
else
    echo "⚠️  System Status: BLOCKED BY CORS"
    echo "   → Fix S3 CORS policy first"
    echo "   → Then image uploads will work"
fi

echo ""
