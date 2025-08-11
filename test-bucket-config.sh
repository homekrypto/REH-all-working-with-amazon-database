#!/bin/bash

echo "🔍 DIAGNOSTIC: Checking Bucket Configuration"
echo "============================================="
echo ""

echo "📋 Current Environment Variables:"
echo "AWS_S3_BUCKET_NAME: $(grep AWS_S3_BUCKET_NAME .env.local)"
echo "AWS_REGION: $(grep AWS_REGION .env.local)"
echo ""

echo "📋 Code Configuration:"
echo "Checking image-processing.ts for bucket name..."
grep "BUCKET_NAME.*=" src/lib/image-processing.ts
echo ""

echo "📋 CORS Test Results:"
echo "Testing CORS on real-estate-hub bucket..."
CORS_TEST=$(curl -s -I \
  -H "Origin: http://localhost:5544" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type" \
  -X OPTIONS \
  "https://real-estate-hub.s3.eu-north-1.amazonaws.com/" 2>/dev/null)

if echo "$CORS_TEST" | grep -q "access-control-allow-origin"; then
    echo "✅ CORS is working for real-estate-hub!"
    echo "Origin allowed: $(echo "$CORS_TEST" | grep -i access-control-allow-origin)"
else
    echo "❌ CORS is NOT working for real-estate-hub"
fi
echo ""

echo "🚀 NEXT STEPS:"
echo "1. The code now uses 'real-estate-hub' bucket"
echo "2. CORS is configured for real-estate-hub"
echo "3. Try uploading images again in your browser"
echo "4. If still failing, check browser dev tools for the exact error"
echo ""

echo "💡 If you still see 'real-estate-images' in errors:"
echo "   - Hard refresh the browser (Cmd+Shift+R)"
echo "   - Clear browser cache"
echo "   - Check if any cached JavaScript is using old bucket name"
