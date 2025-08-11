#!/bin/bash

echo "🔧 S3 Bucket Creation - For Account 993249066711"
echo "==============================================="
echo

# Variables
NEW_BUCKET="real-estate-hub-v2"
REGION="eu-north-1"
TARGET_ACCOUNT="993249066711"
AWS_PROFILE="myaccount"  # Change this if you use a different profile name

echo "📋 Step 1: AWS Configuration Check"
echo "---------------------------------"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   brew install awscli  # macOS"
    exit 1
fi

# Check if the profile exists
if ! aws configure list-profiles | grep -q "^$AWS_PROFILE$"; then
    echo "❌ AWS profile '$AWS_PROFILE' not found."
    echo ""
    echo "Please configure it first:"
    echo "   aws configure --profile $AWS_PROFILE"
    echo ""
    echo "Use credentials from your AWS account: $TARGET_ACCOUNT"
    exit 1
fi

# Check if we're using the correct account
echo "Checking AWS account..."
CURRENT_ACCOUNT=$(aws sts get-caller-identity --profile $AWS_PROFILE --query Account --output text 2>/dev/null)

if [ "$CURRENT_ACCOUNT" != "$TARGET_ACCOUNT" ]; then
    echo "❌ Wrong AWS account!"
    echo "   Current: $CURRENT_ACCOUNT"
    echo "   Expected: $TARGET_ACCOUNT"
    echo ""
    echo "Please reconfigure with correct credentials:"
    echo "   aws configure --profile $AWS_PROFILE"
    exit 1
fi

echo "✅ AWS CLI configured for correct account: $TARGET_ACCOUNT"

echo
read -p "🤔 Create bucket '$NEW_BUCKET' in account $TARGET_ACCOUNT? (y/N): " -n 1 -r
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
aws s3 mb s3://$NEW_BUCKET --region $REGION --profile $AWS_PROFILE

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
    --profile $AWS_PROFILE \
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
aws s3api put-bucket-policy --bucket $NEW_BUCKET --profile $AWS_PROFILE --policy file:///tmp/bucket-policy.json

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
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag", "x-amz-meta-*"],
            "MaxAgeSeconds": 3000
        }
    ]
}'

echo "$CORS_CONFIG" > /tmp/cors-config.json
aws s3api put-bucket-cors --bucket $NEW_BUCKET --profile $AWS_PROFILE --cors-configuration file:///tmp/cors-config.json

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
echo "🎉 Bucket Creation Complete!"
echo "==========================="
echo
echo "New bucket details:"
echo "  Name: $NEW_BUCKET"
echo "  Region: $REGION"
echo "  Account: $TARGET_ACCOUNT"
echo "  URL: https://$NEW_BUCKET.s3.$REGION.amazonaws.com/"
echo "  Public access: ✅ Enabled"
echo "  CORS: ✅ Configured"
echo
echo "📋 Next Steps:"
echo "1. Update your .env.local file:"
echo "   AWS_S3_BUCKET_NAME=$NEW_BUCKET"
echo "   AWS_REGION=$REGION"
echo
echo "2. Update AWS credentials in .env.local to match account $TARGET_ACCOUNT"
echo
echo "3. Test image uploads in your application"
echo
echo "⏰ Note: AWS changes may take a few minutes to propagate globally."
