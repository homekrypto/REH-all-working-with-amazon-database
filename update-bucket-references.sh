#!/bin/bash

echo "🔄 Updating Code References to New S3 Bucket"
echo "============================================"
echo

OLD_BUCKET="real-estate-hub"
NEW_BUCKET="real-estate-hub-v2"
REGION="eu-north-1"

echo "📋 Updating files to use new bucket: $NEW_BUCKET"
echo

# Update environment variables
echo "1. Updating .env.local..."
if [ -f ".env.local" ]; then
    # Backup current env file
    cp .env.local .env.local.backup
    
    # Update bucket name
    sed -i.bak "s/S3_BUCKET_NAME=.*/S3_BUCKET_NAME=$NEW_BUCKET/" .env.local
    sed -i.bak "s/S3_REGION=.*/S3_REGION=$REGION/" .env.local
    
    # Add if not exists
    if ! grep -q "S3_BUCKET_NAME" .env.local; then
        echo "S3_BUCKET_NAME=$NEW_BUCKET" >> .env.local
    fi
    if ! grep -q "S3_REGION" .env.local; then
        echo "S3_REGION=$REGION" >> .env.local
    fi
    
    rm -f .env.local.bak
    echo "✅ .env.local updated"
else
    echo "Creating .env.local with new bucket settings..."
    cat >> .env.local << EOF
S3_BUCKET_NAME=$NEW_BUCKET
S3_REGION=$REGION
EOF
    echo "✅ .env.local created"
fi

echo

# Update image processing file
echo "2. Updating src/lib/image-processing.ts..."
if [ -f "src/lib/image-processing.ts" ]; then
    cp src/lib/image-processing.ts src/lib/image-processing.ts.backup
    sed -i.bak "s/$OLD_BUCKET/$NEW_BUCKET/g" src/lib/image-processing.ts
    rm -f src/lib/image-processing.ts.bak
    echo "✅ image-processing.ts updated"
else
    echo "⚠️  src/lib/image-processing.ts not found"
fi

echo

# Update Next.js config
echo "3. Updating next.config.ts..."
if [ -f "next.config.ts" ]; then
    cp next.config.ts next.config.ts.backup
    sed -i.bak "s/$OLD_BUCKET/$NEW_BUCKET/g" next.config.ts
    rm -f next.config.ts.bak
    echo "✅ next.config.ts updated"
else
    echo "⚠️  next.config.ts not found"
fi

echo

# Update any upload endpoints
echo "4. Checking for upload endpoints..."
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "$OLD_BUCKET" 2>/dev/null | while read file; do
    echo "   Updating: $file"
    cp "$file" "$file.backup"
    sed -i.bak "s/$OLD_BUCKET/$NEW_BUCKET/g" "$file"
    rm -f "$file.bak"
done

echo

# Update property detail page proxy
echo "5. Updating property detail page..."
if [ -f "src/app/properties/[id]/page.tsx" ]; then
    cp "src/app/properties/[id]/page.tsx" "src/app/properties/[id]/page.tsx.backup"
    sed -i.bak "s/$OLD_BUCKET/$NEW_BUCKET/g" "src/app/properties/[id]/page.tsx"
    rm -f "src/app/properties/[id]/page.tsx.bak"
    echo "✅ Property detail page updated"
fi

echo

echo "🎉 Code Update Complete!"
echo "======================="
echo
echo "Updated bucket references from '$OLD_BUCKET' to '$NEW_BUCKET'"
echo
echo "Files updated:"
echo "✅ .env.local"
echo "✅ src/lib/image-processing.ts"
echo "✅ next.config.ts"
echo "✅ Property detail page"
echo "✅ Any other files containing bucket references"
echo
echo "📋 Next Steps:"
echo "1. Restart your development server to pick up new environment variables"
echo "2. Test image uploads with the new bucket"
echo "3. Verify images display correctly"
echo
echo "💾 Backup files created with .backup extension"
echo "   Remove them after confirming everything works correctly"
