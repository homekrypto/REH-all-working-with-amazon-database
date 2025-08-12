#!/bin/bash

# Manual AWS Console Deployment Guide
# Since CLI requires additional IAM permissions, we'll guide through console deployment

echo "🚨 AWS Amplify CLI requires additional IAM permissions."
echo "📋 Let's deploy via AWS Console instead:"
echo ""
echo "🔗 Step-by-step deployment:"
echo ""
echo "1. Open AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "2. Click 'Create new app' → 'Host web app'"
echo ""
echo "3. Connect GitHub:"
echo "   - Select 'GitHub'"
echo "   - Authorize AWS Amplify"
echo "   - Repository: homekrypto/REH-all-working-with-amazon-database"
echo "   - Branch: main"
echo ""
echo "4. Build settings (should auto-detect amplify.yml):"
echo "   - Build command: npm run build"
echo "   - Output directory: .next"
echo "   - Node.js version: 18"
echo ""
echo "5. Environment Variables:"
echo "   Copy from: amplify-env-vars-private.txt"
echo "   Add each variable in: App Settings → Environment Variables"
echo ""
echo "6. Click 'Save and Deploy'"
echo ""
echo "📱 Monitor deployment at:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "✅ After deployment:"
echo "   1. Get your Amplify URL"
echo "   2. Add NEXTAUTH_URL environment variable"
echo "   3. Update Google OAuth redirect URIs"
echo "   4. Test the application"
echo ""

# Open the browser to AWS Console
if command -v open &> /dev/null; then
    echo "🌐 Opening AWS Amplify Console..."
    open "https://console.aws.amazon.com/amplify/"
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening AWS Amplify Console..."
    xdg-open "https://console.aws.amazon.com/amplify/"
else
    echo "Please manually open: https://console.aws.amazon.com/amplify/"
fi

echo ""
echo "📄 Environment variables are in: amplify-env-vars-private.txt"
echo "📖 Full guide available in: AMPLIFY_DEPLOYMENT_GUIDE.md"
