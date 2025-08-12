#!/bin/bash

# Alternative: AWS Amplify CLI Deployment Script
# Run this if Console deployment has issues

echo "🚀 Setting up AWS Amplify CLI deployment..."

# Initialize Amplify project
amplify init \
  --appId YOUR_APP_ID \
  --envName production \
  --defaultEditor code \
  --yes

# Add hosting
amplify add hosting

# Configure environment variables
echo "Setting up environment variables..."
amplify env pull --yes

# Deploy
echo "Deploying to AWS Amplify..."
amplify push --yes

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://main.YOUR_APP_ID.amplifyapp.com"
