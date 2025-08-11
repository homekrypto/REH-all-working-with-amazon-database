#!/bin/bash

echo "🔧 Fixing S3 bucket policy for public image access..."
echo

BUCKET_NAME="real-estate-hub"
REGION="eu-north-1"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

echo "📋 Setting public read policy for images..."

# Create a bucket policy that allows public read access to all objects
POLICY='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::real-estate-hub/*"
        }
    ]
}'

# Apply the bucket policy
echo "Applying bucket policy..."
aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy "$POLICY" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ Bucket policy applied successfully!"
else
    echo "❌ Failed to apply bucket policy"
    exit 1
fi

echo
echo "🧪 Testing image access..."
sleep 2

# Test if the image is now accessible
TEST_URL="https://real-estate-hub.s3.eu-north-1.amazonaws.com/listings/cme70an9q0001xbe8sftm5072/seo-test-data-apt-large.webp"
RESPONSE=$(curl -s -I "$TEST_URL")

if echo "$RESPONSE" | grep -q "200 OK"; then
    echo "✅ Images are now publicly accessible!"
else
    echo "❌ Images still not accessible"
    echo "Response: $RESPONSE"
fi

echo
echo "🎯 If images are still not accessible, you may need to:"
echo "1. Check AWS credentials and permissions"
echo "2. Verify bucket ownership"
echo "3. Ensure no other policies are blocking access"
