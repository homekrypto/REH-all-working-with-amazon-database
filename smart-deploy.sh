#!/bin/bash

# Smart AWS Amplify Deployment
# Tries CLI first, falls back to manual instructions

set -e

echo "🚀 AWS Amplify Deployment - Smart Deploy"
echo "========================================"

# Check AWS CLI configuration
echo "🔍 Checking AWS credentials..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run: aws configure"
    exit 1
fi

USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
echo "✅ AWS User: $USER_ARN"

# Test Amplify permissions
echo "🔍 Testing Amplify permissions..."
if aws amplify list-apps --region eu-north-1 > /dev/null 2>&1; then
    echo "✅ Amplify permissions confirmed"
    
    # Try to create app via CLI
    echo "🚀 Creating Amplify app via CLI..."
    
    APP_ID=$(aws amplify create-app \
        --name "realestate-platform" \
        --description "Real Estate Platform - Next.js with PostgreSQL, Stripe, S3" \
        --repository "https://github.com/homekrypto/REH-all-working-with-amazon-database" \
        --oauth-token "$GITHUB_TOKEN" \
        --platform "WEB" \
        --region eu-north-1 \
        --query 'app.appId' \
        --output text)
    
    echo "✅ App created with ID: $APP_ID"
    
    # Create branch
    echo "🌿 Creating main branch..."
    aws amplify create-branch \
        --app-id "$APP_ID" \
        --branch-name "main" \
        --region eu-north-1
    
    # Start deployment
    echo "🚀 Starting deployment..."
    JOB_ID=$(aws amplify start-job \
        --app-id "$APP_ID" \
        --branch-name "main" \
        --job-type "RELEASE" \
        --region eu-north-1 \
        --query 'jobSummary.jobId' \
        --output text)
    
    echo "✅ Deployment started - Job ID: $JOB_ID"
    echo "🌐 Monitor at: https://console.aws.amazon.com/amplify/home?region=eu-north-1#/$APP_ID"
    echo ""
    echo "⚠️  IMPORTANT: Add environment variables manually in the console!"
    echo "📄 Variables are in: amplify-env-vars-private.txt"
    
else
    echo "❌ Insufficient Amplify permissions for CLI deployment"
    echo ""
    echo "📋 Using Manual Console Deployment:"
    echo "=================================="
    echo ""
    echo "1. Open: https://console.aws.amazon.com/amplify/"
    echo "2. Click 'Create new app' → 'Host web app'"
    echo "3. Connect GitHub: homekrypto/REH-all-working-with-amazon-database"
    echo "4. Branch: main"
    echo "5. Build settings: Auto-detected from amplify.yml"
    echo "6. Add environment variables from: amplify-env-vars-private.txt"
    echo "7. Deploy!"
    echo ""
    echo "🌐 Opening AWS Console..."
    
    # Open browser
    if command -v open &> /dev/null; then
        open "https://console.aws.amazon.com/amplify/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://console.aws.amazon.com/amplify/"
    fi
fi

echo ""
echo "📖 Full deployment guide: AMPLIFY_DEPLOYMENT_GUIDE.md"
