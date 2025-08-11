#!/bin/bash

echo "🗑️  S3 Bucket Recreation Guide"
echo "If you want to start fresh with a properly configured bucket"
echo

BUCKET_NAME="real-estate-hub-v2"
REGION="eu-north-1"

echo "📋 Steps to recreate S3 bucket with proper permissions:"
echo

echo "1. Delete existing bucket (if you have AWS CLI access):"
echo "   aws s3 rb s3://real-estate-hub --force --region eu-north-1"
echo

echo "2. Create new bucket with public access:"
cat << 'EOF'
aws s3 mb s3://real-estate-hub-v2 --region eu-north-1

aws s3api put-bucket-policy --bucket real-estate-hub-v2 --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::real-estate-hub-v2/*"
        }
    ]
}'

aws s3api put-bucket-cors --bucket real-estate-hub-v2 --cors-configuration '{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}'
EOF

echo
echo "3. Update environment variables:"
echo "   S3_BUCKET_NAME=real-estate-hub-v2"
echo

echo "4. Update bucket name in:"
echo "   - src/lib/image-processing.ts"
echo "   - Any upload endpoints"
echo

echo "🎯 This creates a bucket with:"
echo "✅ Public read access for all objects"
echo "✅ Proper CORS configuration"
echo "✅ No authentication required for viewing images"
