# Image Upload Bug Fix Documentation

## Bug Description
**Issue**: Only 1 image was being saved to S3 and database despite frontend showing successful upload of multiple images (e.g., 3 images).

**Symptoms**:
- Frontend correctly uploads multiple images to S3 temporary storage
- Frontend shows success message for all uploaded images
- Only 1 image appears in the final property listing
- S3 bucket contains only 1 image (4 sizes: large, medium, small, thumbnail)
- Database contains only 1 image record

## Root Cause Analysis
The bug was in the `processImage` function in `/src/lib/image-processing.ts`:

```typescript
// BEFORE (buggy code)
const baseFilename = generateSEOFilename(propertyTitle, imageSubject)
const storageKey = `listings/${listingId}/${baseFilename}`
```

**Problem**: When multiple images had the same or empty `imageSubject`, they would all get the same `baseFilename`, resulting in the same S3 `storageKey`. This caused later images to overwrite earlier ones in S3.

**Example of collision**:
- Image 1: `listings/cme123/beautiful-house-in-miami`
- Image 2: `listings/cme123/beautiful-house-in-miami` (same!)
- Image 3: `listings/cme123/beautiful-house-in-miami` (same!)

## Solution
Added an `index` parameter to ensure each image gets a unique filename:

### 1. Updated ImageProcessingOptions interface:
```typescript
export interface ImageProcessingOptions {
  listingId: string
  propertyTitle: string
  location: string
  imageSubject?: string
  originalFilename: string
  tempKey: string
  index?: number // NEW: Add index to ensure unique filenames
}
```

### 2. Updated processImage function:
```typescript
// AFTER (fixed code)
const baseFilename = generateSEOFilename(propertyTitle, imageSubject, index)
const storageKey = `listings/${listingId}/${baseFilename}`
```

### 3. Updated API route to pass index:
```typescript
const processedImage = await processImage({
  listingId: created.id,
  propertyTitle: title,
  location,
  imageSubject,
  originalFilename,
  tempKey,
  index: i // NEW: Pass the index to ensure unique filenames
})
```

## Expected Behavior After Fix
**Unique filenames with index**:
- Image 1: `listings/cme123/beautiful-house-in-miami-living-room-1`
- Image 2: `listings/cme123/beautiful-house-in-miami-kitchen-2`  
- Image 3: `listings/cme123/beautiful-house-in-miami-3`

**Results**:
- ✅ All 3 images visible on property page
- ✅ S3 contains 12 files (3 images × 4 sizes each)
- ✅ Database contains 3 image records
- ✅ Each image has unique SEO-friendly filename

## Testing Steps
1. Start server: `npm run dev`
2. Go to: http://localhost:5544/add-listing
3. Login as agent: me@p.pl / testpassword123
4. Upload 3 different images
5. Fill form and submit
6. Verify all 3 images appear on property page
7. Run: `./debug-image-upload.sh` to verify S3/DB

## Files Modified
- `/src/lib/image-processing.ts` - Added index parameter
- `/src/app/api/listings/route.ts` - Pass index to processImage

## Verification
Run test filename generation:
```bash
node test-filename-generation.js
```

Expected output:
```
Image 1: listings/test-listing-id/beautiful-house-in-miami-living-room-1
Image 2: listings/test-listing-id/beautiful-house-in-miami-kitchen-2
Image 3: listings/test-listing-id/beautiful-house-in-miami-3
```
