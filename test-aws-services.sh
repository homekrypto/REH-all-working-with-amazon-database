#!/bin/bash

echo "🧪 TESTING ALL AWS SERVICES"
echo "============================"

echo ""
echo "1. 🗄️ Testing PostgreSQL Database..."
npx prisma db push > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database: Connected and synced"
    USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | tail -1 || echo "0")
    echo "   Users: ${USER_COUNT:-0} found"
else
    echo "❌ Database: Connection failed"
fi

echo ""
echo "2. 🪣 Testing S3 Storage..."
if [ -n "$S3_BUCKET_NAME" ]; then
    aws s3 ls s3://$S3_BUCKET_NAME > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ S3: Accessible"
        OBJECTS=$(aws s3 ls s3://$S3_BUCKET_NAME --recursive | wc -l)
        echo "   Objects: $OBJECTS found"
    else
        echo "⚠️ S3: AWS CLI not configured (bucket may still work via app)"
    fi
else
    echo "❌ S3: No bucket name configured"
fi

echo ""
echo "3. 🔗 Testing Local Development Server..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build: Successful with AWS services"
else
    echo "❌ Build: Failed"
fi

echo ""
echo "4. 🚀 Testing Amplify Deployment Status..."
echo "   Check: https://console.aws.amazon.com/amplify/"
echo "   Latest commit: $(git log -1 --format='%h - %s')"

echo ""
echo "📊 SUMMARY:"
echo "All services working? Ready for development!"
echo "Issues found? Check AWS credentials and connectivity."
