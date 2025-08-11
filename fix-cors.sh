#!/bin/bash

echo "🔧 S3 CORS Configuration Fix"
echo "=============================="
echo ""
echo "You need to update the CORS policy for your S3 bucket:"
echo "Bucket: real-estate-images"
echo "Region: eu-north-1"
echo ""
echo "⚠️  IMPORTANT: Go to your AWS S3 Console and:"
echo ""
echo "1. Open bucket: real-estate-images"
echo "2. Go to Permissions tab"
echo "3. Scroll to 'Cross-origin resource sharing (CORS)'"
echo "4. Click 'Edit' and replace with this JSON:"
echo ""
cat << 'EOF'
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "GET"
        ],
        "AllowedOrigins": [
            "http://localhost:5544"
        ],
        "ExposeHeaders": []
    }
]
EOF
echo ""
echo "5. Click 'Save changes'"
echo ""
echo "💡 After updating CORS, restart the dev server:"
echo "   npm run dev"
echo ""
