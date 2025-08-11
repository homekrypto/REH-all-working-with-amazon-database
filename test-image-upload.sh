#!/bin/bash

echo "🧪 Testing SEO Image Upload System"
echo "=================================="

# Check if .env.local has AWS credentials
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Run ./setup-local-testing.sh first"
    exit 1
fi

# Check if AWS credentials are configured
if ! grep -q "AWS_ACCESS_KEY_ID=AKIA" .env.local; then
    echo "⚠️  AWS credentials not configured in .env.local"
    echo "   Follow QUICK_AWS_SETUP.md to configure AWS"
    exit 1
fi

echo "✅ Environment configuration looks good"

# Start the dev server in background
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait a bit for server to start
sleep 5

echo ""
echo "🎉 Test environment ready!"
echo ""
echo "📍 Open in browser: http://localhost:5544/add-listing"
echo ""
echo "🧪 Testing steps:"
echo "1. Register/login if needed"
echo "2. Fill in property details"
echo "3. Drag & drop some test images"
echo "4. Add subject tags (Kitchen, Living Room, etc.)"
echo "5. Submit the listing"
echo "6. Check your S3 bucket for processed images"
echo ""
echo "🔍 What to verify:"
echo "   ✓ Images upload with progress bars"
echo "   ✓ SEO-friendly filenames in S3"
echo "   ✓ Multiple image sizes generated"
echo "   ✓ Database records created"
echo "   ✓ No console errors"
echo ""
echo "Press Ctrl+C to stop the dev server when done testing"

# Keep the script running
wait $DEV_PID
