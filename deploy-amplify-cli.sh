#!/bin/bash

# AWS Amplify CLI Deployment Script
# Deploy Real Estate Platform to AWS Amplify

set -e  # Exit on any error

echo "🚀 Starting AWS Amplify CLI deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Initialize Amplify project with configuration
echo "📝 Initializing Amplify project..."
amplify init \
  --envName production \
  --defaultEditor code \
  --amplifyConfigs '{
    "projectName": "realestate-platform",
    "envName": "production",
    "defaultEditor": "code",
    "appType": "javascript",
    "framework": "react",
    "srcDir": "src",
    "distDir": ".next",
    "buildDir": "/",
    "startCommand": "npm run start",
    "hasTraversal": true,
    "autocompleteShown": false
  }' \
  --frontendConfig '{
    "frontend": "javascript",
    "framework": "react",
    "config": {
      "SourceDir": "src",
      "DistributionDir": ".next",
      "BuildCommand": "npm run build",
      "StartCommand": "npm run start"
    }
  }' \
  --providers '{
    "awscloudformation": {
      "configLevel": "project",
      "useProfile": true,
      "profileName": "default"
    }
  }' \
  --yes

echo "🌐 Adding hosting..."
amplify add hosting \
  --type CICD \
  --repository https://github.com/homekrypto/REH-all-working-with-amazon-database \
  --branch main \
  --buildSpec amplify.yml \
  --yes

echo "🔧 Setting up environment variables..."
# Note: Environment variables need to be set manually in AWS Console
# or via AWS CLI after app creation

echo "🚀 Deploying to AWS Amplify..."
amplify push --yes

echo ""
echo "✅ Deployment initiated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to AWS Amplify Console to monitor the build"
echo "2. Add environment variables (see amplify-env-vars-private.txt)"
echo "3. Wait for build completion"
echo ""
echo "🌐 Your app will be available at the URL shown in the AWS Console"
