#!/bin/bash

echo "🧪 QUICK DEPLOYMENT TEST"
echo "======================="
echo ""

echo "📍 Testing main app URL..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://main.d1ec4l2vmh6hbe.amplifyapp.com/")
echo "Main app response code: $RESPONSE"

if [ "$RESPONSE" = "200" ]; then
    echo "✅ Main app is loading correctly"
elif [ "$RESPONSE" = "307" ]; then
    echo "❌ Main app still redirecting to auth error"
    echo "🔧 NEXTAUTH_URL trailing slash issue not fixed yet"
else
    echo "⚠️  Unexpected response code: $RESPONSE"
fi

echo ""
echo "🔐 Testing environment variables detection..."
ENV_TEST=$(curl -s "https://main.d1ec4l2vmh6hbe.amplifyapp.com/api/auth-test" | jq -r '.config.NEXTAUTH_SECRET_EXISTS')
echo "NEXTAUTH_SECRET_EXISTS: $ENV_TEST"

if [ "$ENV_TEST" = "true" ]; then
    echo "✅ Environment variables are now being detected!"
    echo "🎉 NEXTAUTH_URL fix successful!"
elif [ "$ENV_TEST" = "false" ]; then
    echo "❌ Environment variables still not detected"
    echo "🔧 NEXTAUTH_URL trailing slash still needs to be fixed"
else
    echo "⚠️  Unable to test environment variables"
fi

echo ""
echo "📋 SUMMARY:"
if [ "$RESPONSE" = "200" ] && [ "$ENV_TEST" = "true" ]; then
    echo "🎉 SUCCESS! Deployment is working correctly"
    echo "✅ All environment variables detected"
    echo "✅ Authentication should now work"
    echo "✅ Ready for full testing"
else
    echo "❌ NEXTAUTH_URL trailing slash still needs to be fixed in Amplify Console"
    echo "🔧 Change from: https://main.d1ec4l2vmh6hbe.amplifyapp.com/"
    echo "🔧 Change to:   https://main.d1ec4l2vmh6hbe.amplifyapp.com"
    echo "🔄 Then trigger redeploy and run this test again"
fi

echo ""
