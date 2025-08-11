#!/bin/bash

echo "🚨 URGENT: S3 CORS Policy Fix Required"
echo "======================================"
echo ""

echo "❌ Current Status: Image uploads are FAILING"
echo "💡 Reason: S3 bucket CORS policy not configured"
echo ""

echo "🔧 IMMEDIATE FIX REQUIRED:"
echo ""
echo "1. Open in new tab: https://s3.console.aws.amazon.com/"
echo "2. Search for bucket: real-estate-hub"
echo "3. Click on the bucket name"
echo "4. Click 'Permissions' tab"
echo "5. Scroll to 'Cross-origin resource sharing (CORS)'"
echo "6. Click 'Edit' button"
echo "7. COPY & PASTE this exact JSON (replace everything):"
echo ""
echo "=================================================="

cat << 'EOF'
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET"],
        "AllowedOrigins": ["http://localhost:5544"],
        "ExposeHeaders": []
    }
]
EOF

echo "=================================================="
echo ""
echo "8. Click 'Save changes'"
echo "9. Return to your browser and try uploading again"
echo ""

echo "⏱️  This should take less than 2 minutes to fix!"
echo ""

echo "🧪 Testing current CORS status..."
CORS_TEST=$(curl -s -I \
  -H "Origin: http://localhost:5544" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type" \
  -X OPTIONS \
  "https://real-estate-hub.s3.eu-north-1.amazonaws.com/" 2>/dev/null)

if echo "$CORS_TEST" | grep -q "access-control-allow-origin"; then
    echo "✅ CORS is working!"
else
    echo "❌ CORS is NOT configured - uploads will fail"
    echo ""
    echo "📊 S3 Response:"
    echo "$CORS_TEST" | head -5
fi

echo ""
echo "🔄 After updating CORS, run this command to test:"
echo "   ./test-cors.sh"
echo ""
echo "💡 Once CORS is fixed, image uploads will work perfectly!"
echo ""
