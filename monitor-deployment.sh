#!/bin/bash

echo "🔄 DEPLOYMENT PROGRESS MONITOR"
echo "============================"
echo "📅 $(date)"
echo "🌐 Site: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo ""

# Function to check deployment status
check_deployment() {
    local auth_status=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/auth-test" | jq -r '.config.NEXTAUTH_SECRET_EXISTS' 2>/dev/null)
    echo "$auth_status"
}

echo "🚀 Monitoring deployment progress..."
echo "⏳ Checking every 30 seconds for environment variable activation..."
echo ""

# Check initial status
initial_status=$(check_deployment)
echo "📊 Initial status: NEXTAUTH_SECRET_EXISTS = $initial_status"

# If already true, deployment is complete
if [[ "$initial_status" == "true" ]]; then
    echo "✅ Environment variables are already active!"
    echo "🧪 Running full verification..."
    ./verify-production.sh
    exit 0
fi

# Monitor for changes
attempt=1
max_attempts=20  # 10 minutes total

while [[ $attempt -le $max_attempts ]]; do
    echo "🔍 Attempt $attempt/$max_attempts - Checking deployment status..."
    
    current_status=$(check_deployment)
    
    if [[ "$current_status" == "true" ]]; then
        echo ""
        echo "🎉 SUCCESS! Environment variables are now active!"
        echo "⏱️  Deployment completed in $((attempt * 30)) seconds"
        echo ""
        echo "🧪 Running full verification test..."
        ./verify-production.sh
        break
    elif [[ "$current_status" == "false" ]]; then
        echo "   ⏳ Still deploying... (Status: $current_status)"
    else
        echo "   ⚠️  API response unclear: $current_status"
    fi
    
    if [[ $attempt -eq $max_attempts ]]; then
        echo ""
        echo "⏰ TIMEOUT REACHED"
        echo "================================="
        echo "❌ Deployment taking longer than expected (10 minutes)"
        echo ""
        echo "🔍 Possible issues:"
        echo "• Build might have failed - check AWS Amplify Console"
        echo "• Environment variables might not be properly set"
        echo "• AWS service delays"
        echo ""
        echo "🛠️  Next steps:"
        echo "1. Check build logs: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/hosting"
        echo "2. Verify environment variables: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/settings/variables"
        echo "3. Try manual redeploy if build failed"
        echo "4. Run ./verify-production.sh manually to check current status"
        break
    fi
    
    sleep 30
    ((attempt++))
done

echo ""
echo "🔗 Useful Links:"
echo "• Live Site: https://main.d1ec4l2vmh6hbe.amplifyapp.com"
echo "• AWS Console: https://console.aws.amazon.com/amplify/home#/d1ec4l2vmh6hbe/hosting"
echo "• Manual verification: ./verify-production.sh"
