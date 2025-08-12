#!/bin/bash

echo "🔧 Fixing S3 CORS Configuration for Image Uploads"
echo "================================================="
echo ""

BUCKET_NAME="real-estate-hub-michalbabula-2025"
REGION="us-east-1"

echo "📝 Creating CORS configuration..."

# Create CORS configuration file
cat > cors-config.json << 'EOF'
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": [
                "http://localhost:5544",
                "https://localhost:5544",
                "http://127.0.0.1:5544"
            ],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF

echo "🚀 Applying CORS configuration to S3 bucket..."
aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file://cors-config.json --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    echo ""
    echo "🧪 Testing CORS configuration..."
    
    # Test CORS with a preflight request
    CORS_TEST=$(curl -s -I \
        -H "Origin: http://localhost:5544" \
        -H "Access-Control-Request-Method: PUT" \
        -H "Access-Control-Request-Headers: content-type" \
        -X OPTIONS \
        "https://$BUCKET_NAME.s3.$REGION.amazonaws.com/" 2>/dev/null | grep -i "access-control-allow-origin")
    
    if [ ! -z "$CORS_TEST" ]; then
        echo "✅ CORS test passed!"
        echo "🎉 Image uploads should now work!"
    else
        echo "⚠️  CORS test inconclusive, but configuration was applied."
        echo "📸 Try uploading an image to test."
    fi
else
    echo "❌ Failed to apply CORS configuration."
    echo "🔑 Please check your AWS credentials and permissions."
fi

# Cleanup
rm -f cors-config.json

echo ""
echo "🔄 Next steps:"
echo "1. Make sure your AWS credentials are set in .env"
echo "2. Restart your development server: npm run dev"
echo "3. Try uploading an image in the add-listing page"
