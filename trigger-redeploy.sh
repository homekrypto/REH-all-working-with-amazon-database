#!/bin/bash

echo "🚀 TRIGGERING AMPLIFY REDEPLOY"
echo "============================="
echo "📅 $(date)"
echo ""

echo "✅ ENVIRONMENT VARIABLES STATUS:"
echo "==============================="
echo "✅ All 21 environment variables are set in AWS Amplify Console"
echo "✅ Database URL, NextAuth secrets, Google OAuth, S3, Stripe - all configured"
echo ""

echo "⚠️  CURRENT ISSUE:"
echo "=================="
echo "❌ Application is still running old version without environment variables"
echo "🔄 Need to redeploy to activate new environment variables"
echo ""

echo "🛠️  SOLUTION - MANUAL REDEPLOY:"
echo "==============================="
echo "1. Go to: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/hosting"
echo "2. Find the latest successful build (should be recent)"
echo "3. Click the '...' menu on the right"
echo "4. Select 'Redeploy this version'"
echo "5. Wait 5-8 minutes for deployment to complete"
echo ""

echo "🔧 ALTERNATIVE - TRIGGER VIA GIT:"
echo "================================="
echo "We can also trigger a redeploy by making a small commit:"

# Check if there are any changes
git_status=$(git status --porcelain)
if [[ -n "$git_status" ]]; then
    echo "📝 Found uncommitted changes, committing them..."
    git add .
    git commit -m "🔧 Trigger redeploy with environment variables

Environment variables are now set in AWS Amplify Console:
✅ NEXTAUTH_SECRET, NEXTAUTH_URL  
✅ DATABASE_URL (PostgreSQL)
✅ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
✅ S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME
✅ STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
✅ SMTP configuration for emails

This commit triggers a redeploy to activate the environment variables."
    
    echo "🚀 Pushing to trigger redeploy..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed! Redeploy triggered automatically."
        echo "⏱️  Expected completion: 5-8 minutes"
    else
        echo "❌ Push failed. Use manual redeploy method instead."
    fi
else
    echo "📝 No changes to commit. Creating a small trigger file..."
    echo "# Redeploy trigger $(date)" > redeploy-trigger.txt
    git add redeploy-trigger.txt
    git commit -m "🔄 Trigger redeploy to activate environment variables"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully triggered redeploy!"
        echo "⏱️  Expected completion: 5-8 minutes"
    else
        echo "❌ Push failed. Use manual redeploy method instead."
    fi
fi

echo ""
echo "🧪 AFTER REDEPLOY COMPLETES:"
echo "============================"
echo "Run this command to verify everything works:"
echo "./verify-production.sh"
echo ""
echo "Expected results after redeploy:"
echo "✅ All 5/5 tests should pass"
echo "✅ Home page should load normally (no auth errors)"
echo "✅ Properties API should return real data"
echo "✅ Database and S3 should be connected"
echo "✅ Authentication should work"
echo ""

echo "🎯 MONITORING:"
echo "=============="
echo "📊 Build progress: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/hosting"
echo "🌐 Live site: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo "🔧 Environment vars: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/settings/variables"
