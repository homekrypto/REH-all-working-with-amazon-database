#!/bin/bash

# Trigger GitHub Actions Deployment
# This script commits a small change to trigger the deployment workflow

echo "🚀 Triggering GitHub Actions Deployment"
echo "======================================"

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Committing them first..."
    git add .
    git commit -m "Prepare for GitHub Actions deployment"
fi

# Create a deployment trigger file
echo "# Deployment triggered at $(date)" > .deployment-trigger
echo "# GitHub Actions will deploy this commit to AWS Amplify" >> .deployment-trigger

# Commit and push
git add .deployment-trigger
git commit -m "🚀 Trigger AWS Amplify deployment via GitHub Actions

- Updated deployment workflow for Amplify
- Added environment variable support
- Fallback to S3 if Amplify permissions insufficient
- Manual deployment trigger"

echo "📤 Pushing to GitHub to trigger deployment..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📊 Monitor the deployment:"
echo "🔗 GitHub Actions: https://github.com/homekrypto/REH-all-working-with-amazon-database/actions"
echo "🔗 AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo ""
echo "⏰ The deployment typically takes 5-10 minutes"
echo ""
echo "📋 Next steps:"
echo "1. Monitor the GitHub Actions workflow"
echo "2. Check AWS Console for the Amplify app"
echo "3. Add environment variables if app is created"
echo "4. Update NEXTAUTH_URL with the deployed domain"
