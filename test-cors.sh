#!/bin/bash

echo "🧪 Testing S3 CORS Configuration"
echo "================================"
echo ""

echo "📋 Current Environment:"
echo "Bucket: real-estate-images"
echo "Region: eu-north-1" 
echo "Origin: http://localhost:5544"
echo ""

echo "🔍 Testing CORS with a simple fetch..."

# Test if we can make a basic request to the bucket
curl -s -I \
  -H "Origin: http://localhost:5544" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type" \
  -X OPTIONS \
  "https://real-estate-images.s3.eu-north-1.amazonaws.com/" 2>/dev/null | head -n 10

echo ""
echo "📝 Expected headers for working CORS:"
echo "   access-control-allow-origin: http://localhost:5544"
echo "   access-control-allow-methods: PUT, POST, GET"
echo "   access-control-allow-headers: *"
echo ""

echo "⚠️  If you don't see the expected headers above:"
echo ""
echo "🔧 Go to AWS S3 Console RIGHT NOW:"
echo "   1. https://s3.console.aws.amazon.com/"
echo "   2. Open bucket: real-estate-images"  
echo "   3. Permissions tab"
echo "   4. Cross-origin resource sharing (CORS)"
echo "   5. Click Edit"
echo "   6. Replace ALL content with:"
echo ""

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

echo ""
echo "   7. Click 'Save changes'"
echo ""
echo "🚀 After saving, the image upload will work immediately!"
echo ""
