#!/bin/bash

echo "🧪 Testing Multiple Image Upload Fix"
echo "===================================="

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 3

# Test that the server is running
curl -s http://localhost:5544/api/auth/session > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start it with 'npm run dev'"
    exit 1
fi

echo ""
echo "📋 Instructions for testing:"
echo "1. Go to http://localhost:5544/add-listing"
echo "2. Log in as an agent if needed"
echo "3. Upload 3 different images"
echo "4. Fill in the form and submit"
echo "5. Check that all 3 images appear in the property listing"
echo ""
echo "🔍 After testing, run './debug-image-upload.sh' to verify all images are saved"
echo ""
echo "🐛 Expected behavior with fix:"
echo "- All 3 images should be visible on the property page"
echo "- S3 should contain 12 files (3 images × 4 sizes each)"
echo "- Database should have 3 image records"
echo ""
echo "🌐 Opening browser..."
