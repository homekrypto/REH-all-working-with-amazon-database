#!/bin/bash

echo "🔧 S3 Bucket Recreation - Automated Script"
echo "=========================================="
echo

# Variables
OLD_BUCKET="real-estate-hub"
NEW_BUCKET="real-estate-hub-v2"
REGION="eu-north-1"

echo "📋 Step 1: AWS Configuration Check"
echo "---------------------------------"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   brew install awscli  # macOS"
    echo "   pip install awscli   # Python"
    echo
    echo "Then configure with: aws configure"
    exit 1
fi

# Check AWS configuration
echo "Checking AWS configuration..."
AWS_CONFIG=$(aws configure list 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ AWS CLI configured"
    echo "$AWS_CONFIG"
else
    echo "❌ AWS not configured. Run: aws configure"
    exit 1
fi

echo
read -p "🤔 Do you want to proceed with bucket recreation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo
echo "📋 Step 2: Create New Bucket"
echo "---------------------------"

# Create the new bucket
echo "Creating bucket: $NEW_BUCKET in region: $REGION"
aws s3 mb s3://$NEW_BUCKET --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Bucket '$NEW_BUCKET' created successfully!"
else
    echo "❌ Failed to create bucket. Possible reasons:"
    echo "   - Bucket name already exists globally"
    echo "   - Insufficient permissions"
    echo "   - Invalid region"
    exit 1
fi

echo
echo "📋 Step 3: Configure Public Access"
echo "---------------------------------"

# Disable block public access settings
echo "Configuring public access settings..."
aws s3api put-public-access-block \
    --bucket $NEW_BUCKET \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if [ $? -eq 0 ]; then
    echo "✅ Public access settings configured!"
else
    echo "❌ Failed to configure public access"
    exit 1
fi

echo
echo "📋 Step 4: Set Public Read Policy"
echo "--------------------------------"

# Create and apply bucket policy
echo "Applying public read policy..."

POLICY='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'$NEW_BUCKET'/*"
        }
    ]
}'

echo "$POLICY" > /tmp/bucket-policy.json
aws s3api put-bucket-policy --bucket $NEW_BUCKET --policy file:///tmp/bucket-policy.json

if [ $? -eq 0 ]; then
    echo "✅ Public read policy applied successfully!"
    rm -f /tmp/bucket-policy.json
else
    echo "❌ Failed to apply bucket policy"
    rm -f /tmp/bucket-policy.json
    exit 1
fi

echo
echo "📋 Step 5: Configure CORS"
echo "------------------------"

# Create and apply CORS configuration
echo "Configuring CORS..."

CORS_CONFIG='{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["http://localhost:5544", "http://localhost:3000", "https://yourdomain.com"],
            "ExposeHeaders": ["ETag", "x-amz-meta-*"],
            "MaxAgeSeconds": 3000
        }
    ]
}'

echo "$CORS_CONFIG" > /tmp/cors-config.json
aws s3api put-bucket-cors --bucket $NEW_BUCKET --cors-configuration file:///tmp/cors-config.json

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    rm -f /tmp/cors-config.json
else
    echo "❌ Failed to apply CORS configuration"
    rm -f /tmp/cors-config.json
    exit 1
fi

echo
echo "📋 Step 6: Test Bucket Access"
echo "----------------------------"

sleep 3  # Wait for AWS propagation

echo "Testing bucket access..."
TEST_URL="https://$NEW_BUCKET.s3.$REGION.amazonaws.com/"
RESPONSE=$(curl -s -I "$TEST_URL" 2>/dev/null)

if echo "$RESPONSE" | grep -q "200 OK"; then
    echo "✅ Bucket is publicly accessible!"
elif echo "$RESPONSE" | grep -q "403 Forbidden"; then
    echo "⚠️  Bucket exists but may need time to propagate permissions"
else
    echo "❌ Bucket access test inconclusive"
fi

echo "Bucket URL: $TEST_URL"

echo
echo "🎉 Bucket Recreation Complete!"
echo "============================="
echo
echo "New bucket details:"
echo "  Name: $NEW_BUCKET"
echo "  Region: $REGION"
echo "  URL: https://$NEW_BUCKET.s3.$REGION.amazonaws.com/"
echo "  Public access: ✅ Enabled"
echo "  CORS: ✅ Configured"
echo
echo "📋 Next Steps:"
echo "1. Update your .env.local file:"
echo "   S3_BUCKET_NAME=$NEW_BUCKET"
echo "   S3_REGION=$REGION"
echo
echo "2. Run the code update script:"
echo "   ./update-bucket-references.sh"
echo
echo "3. Test image uploads in your application"
echo
echo "⏰ Note: AWS changes may take a few minutes to propagate globally."
