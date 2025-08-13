#!/bin/bash

# Quick Amplify status checker
echo "🔍 Checking AWS Amplify deployment status..."

APP_ID="d1ec4l2vmh6hbe"
BRANCH="main"

echo "📱 App ID: $APP_ID"
echo "🌿 Branch: $BRANCH"

# Get latest deployment
echo "🚀 Getting latest deployment status..."
aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH --max-items 1 --region eu-north-1 2>/dev/null || echo "ℹ️  Use AWS CLI to get more details: aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH --max-items 1 --region eu-north-1"

echo ""
echo "🌐 Direct links:"
echo "• App Console: https://console.aws.amazon.com/amplify/home?region=eu-north-1#/$APP_ID"
echo "• Deployments: https://console.aws.amazon.com/amplify/home?region=eu-north-1#/$APP_ID/deployments"
echo "• Live Site: https://main.$APP_ID.amplifyapp.com"
