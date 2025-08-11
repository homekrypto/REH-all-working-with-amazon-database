#!/bin/bash

echo "🔍 Debugging Image Upload Issue"
echo "==============================="
echo ""

# Get the most recent listing with images
echo "📋 Recent listings with image counts:"
sqlite3 prisma/db/custom.db "
SELECT 
  l.id, 
  l.title, 
  l.createdAt,
  COUNT(li.id) as image_count 
FROM Listing l 
LEFT JOIN ListingImage li ON l.id = li.listingId 
GROUP BY l.id 
ORDER BY l.createdAt DESC 
LIMIT 3;
"

echo ""
echo "📸 Detailed image data for most recent listing:"
LATEST_LISTING=$(sqlite3 prisma/db/custom.db "SELECT id FROM Listing ORDER BY createdAt DESC LIMIT 1;")
echo "Listing ID: $LATEST_LISTING"

sqlite3 prisma/db/custom.db "
SELECT 
  id,
  altText,
  originalName,
  sortOrder,
  url_large
FROM ListingImage 
WHERE listingId = '$LATEST_LISTING'
ORDER BY sortOrder;
"

echo ""
echo "🌐 Checking S3 bucket contents for this listing:"
aws s3 ls s3://real-estate-hub-michalbabula-2025/listings/$LATEST_LISTING/ --profile myaccount 2>/dev/null || echo "No S3 files found or AWS not configured"

echo ""
echo "📝 To test image upload:"
echo "1. Go to http://localhost:5544/add-listing"
echo "2. Upload multiple images"
echo "3. Check browser console for 'imageKeys' in form submission"
echo "4. Re-run this script to see if multiple images were saved"
