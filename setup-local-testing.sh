#!/bin/bash

echo "🚀 Setting up local testing environment for SEO Image Upload System"
echo "===================================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: You need to configure AWS credentials in .env.local"
    echo "   1. Follow the AWS setup steps in LOCAL_TESTING_GUIDE.md"
    echo "   2. Update .env.local with your AWS credentials"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if database exists and is up to date
echo "🗄️  Setting up database..."
npx prisma db push --accept-data-loss 2>/dev/null

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "1. 🔧 Configure AWS S3 (follow LOCAL_TESTING_GUIDE.md steps 1-3)"
echo "2. 🌐 Start dev server: npm run dev"
echo "3. 🖼️  Test image upload at: http://localhost:5544/add-listing"
echo ""
echo "📖 Full guide: LOCAL_TESTING_GUIDE.md"
echo "🔍 Quick test checklist:"
echo "   - Create S3 bucket with CORS"
echo "   - Create IAM user with limited permissions"
echo "   - Update .env.local with AWS credentials"
echo "   - Upload test images via the add-listing page"
echo ""
