#!/bin/bash

# Reliable AWS Console Deployment Guide
# This approach works without complex permissions

echo "🎯 RELIABLE DEPLOYMENT APPROACH"
echo "==============================="
echo ""
echo "Since GitHub Actions had issues, let's use the AWS Console directly:"
echo ""

# Validate build first
echo "1️⃣ VALIDATING BUILD..."
echo "====================="
if npm run build; then
    echo "✅ Build successful - ready for deployment!"
else
    echo "❌ Build failed - please fix errors first"
    exit 1
fi

echo ""
echo "2️⃣ AWS CONSOLE DEPLOYMENT STEPS:"
echo "================================="
echo ""
echo "🌐 Open AWS Amplify Console:"
echo "https://console.aws.amazon.com/amplify/"
echo ""
echo "📋 Follow these exact steps:"
echo ""
echo "1. Click 'Create new app'"
echo "2. Select 'Host web app'"
echo "3. Choose 'GitHub' as source"
echo "4. Authorize Amplify to access GitHub"
echo "5. Select repository: homekrypto/REH-all-working-with-amazon-database"
echo "6. Select branch: main"
echo "7. App name: realestate-platform"
echo "8. Build settings should auto-detect our amplify.yml"
echo "9. Add environment variables (see below)"
echo "10. Click 'Save and deploy'"
echo ""

echo "3️⃣ ENVIRONMENT VARIABLES TO ADD:"
echo "================================="
echo ""
echo "In Amplify Console → App Settings → Environment Variables, add:"
echo ""

# Show environment variables from private file
if [ -f "amplify-env-vars-private.txt" ]; then
    echo "📄 Copy these values:"
    echo ""
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! "$key" =~ ^[[:space:]]*# ]] && [[ -n "$key" ]] && [[ -n "$value" ]]; then
            echo "• $key = $value"
        fi
    done < amplify-env-vars-private.txt
else
    echo "⚠️ amplify-env-vars-private.txt not found"
    echo "Use values from your local .env file"
fi

echo ""
echo "4️⃣ MONITOR DEPLOYMENT:"
echo "======================"
echo "• Build time: ~5-10 minutes"
echo "• Monitor in Amplify Console"
echo "• Get your app URL when complete"
echo ""

echo "5️⃣ POST-DEPLOYMENT:"
echo "==================="
echo "• Update NEXTAUTH_URL with your Amplify domain"
echo "• Update Google OAuth redirect URIs"
echo "• Test the application"
echo ""

# Open the console
echo "🚀 Opening AWS Amplify Console..."
if command -v open &> /dev/null; then
    open "https://console.aws.amazon.com/amplify/"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://console.aws.amazon.com/amplify/"
fi

echo ""
echo "✅ This method is much more reliable than CLI deployment!"
echo "📖 Full guide also available in: AMPLIFY_DEPLOYMENT_GUIDE.md"
