#!/bin/bash

echo "🔧 AMPLIFY CLI FIX FOR NEXTAUTH_URL"
echo "==================================="
echo ""

echo "📋 This script will help you fix the NEXTAUTH_URL using AWS CLI"
echo ""

echo "🔍 First, let's check if AWS CLI is installed:"
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI is installed"
    aws --version
else
    echo "❌ AWS CLI not found. Installing..."
    # For macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing AWS CLI for macOS..."
        curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
        sudo installer -pkg AWSCLIV2.pkg -target /
        rm AWSCLIV2.pkg
    else
        echo "Please install AWS CLI manually: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
fi

echo ""
echo "🔧 Commands to fix NEXTAUTH_URL via AWS CLI:"
echo ""

# Get the app ID from the URL
APP_ID="d1ec4l2vmh6hbe"
echo "Your Amplify App ID: $APP_ID"
echo ""

echo "1. First, delete the problematic NEXTAUTH_URL:"
echo "aws amplify put-app-environment-variables --app-id $APP_ID --environment-variables NEXTAUTH_URL="
echo ""

echo "2. Then set the correct NEXTAUTH_URL:"
echo "aws amplify put-app-environment-variables --app-id $APP_ID --environment-variables NEXTAUTH_URL=https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo ""

echo "3. Trigger a redeploy:"
echo "aws amplify start-job --app-id $APP_ID --branch-name main --job-type RELEASE"
echo ""

echo "🚨 IMPORTANT: Make sure you're logged into AWS CLI first:"
echo "aws configure"
echo ""

echo "📝 MANUAL ALTERNATIVE - Copy these exact commands:"
echo "==============================================="
echo ""
echo "# Delete the variable (sets it to empty)"
echo 'aws amplify put-app-environment-variables --app-id d1ec4l2vmh6hbe --environment-variables NEXTAUTH_URL=""'
echo ""
echo "# Set the correct value"
echo 'aws amplify put-app-environment-variables --app-id d1ec4l2vmh6hbe --environment-variables NEXTAUTH_URL="https://main.d1ec4l2vmh6hbe.amplifyapp.com"'
echo ""
echo "# Trigger redeploy"
echo 'aws amplify start-job --app-id d1ec4l2vmh6hbe --branch-name main --job-type RELEASE'
echo ""

echo "🔄 WEB INTERFACE ALTERNATIVE:"
echo "============================="
echo "1. Try refreshing the Amplify Console page"
echo "2. Look for 'Manage variables' button instead of editing inline"
echo "3. Try using incognito/private browsing mode"
echo "4. Clear browser cache and try again"
echo ""
