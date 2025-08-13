#!/bin/bash

# Test build locally with environment variables to verify Amplify will work
echo "🧪 Testing local build with environment variables..."

# Source environment variables from .env (excluding secrets)
set -a
source .env
set +a

echo "🔍 Environment variable verification:"
test -n "$DATABASE_URL" && echo "✅ DATABASE_URL EXISTS (${#DATABASE_URL} chars)" || echo "❌ DATABASE_URL MISSING"
test -n "$NEXTAUTH_SECRET" && echo "✅ NEXTAUTH_SECRET EXISTS (${#NEXTAUTH_SECRET} chars)" || echo "❌ NEXTAUTH_SECRET MISSING"
test -n "$S3_ACCESS_KEY_ID" && echo "✅ S3_ACCESS_KEY_ID EXISTS (${#S3_ACCESS_KEY_ID} chars)" || echo "❌ S3_ACCESS_KEY_ID MISSING"
test -n "$GOOGLE_CLIENT_ID" && echo "✅ GOOGLE_CLIENT_ID EXISTS (${#GOOGLE_CLIENT_ID} chars)" || echo "❌ GOOGLE_CLIENT_ID MISSING"
test -n "$STRIPE_SECRET_KEY" && echo "✅ STRIPE_SECRET_KEY EXISTS (${#STRIPE_SECRET_KEY} chars)" || echo "❌ STRIPE_SECRET_KEY MISSING"
test -n "$EMAIL_FROM" && echo "✅ EMAIL_FROM EXISTS ($EMAIL_FROM)" || echo "❌ EMAIL_FROM MISSING"

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful! This means Amplify should work too."
else
    echo "❌ Local build failed. Amplify will also fail."
    exit 1
fi
