# Local Testing Guide for SEO Image Upload System

## 🎯 Goal
Test the complete image upload workflow locally with real AWS S3 integration, exactly as it would work in production.

## Phase 1: One-Time Local Setup

### Step 1: Create a Development S3 Bucket

1. **Go to AWS S3 Console**: https://s3.console.aws.amazon.com/
2. **Create a new bucket**:
   - Name: `your-platform-name-dev` (e.g., `realestate-platform-dev`)
   - Region: `us-east-1` (or your preferred region)
   - **Important**: Uncheck "Block all public access" for presigned URLs to work
3. **Configure CORS** (Most critical step):
   - Go to your bucket → Permissions tab → Cross-origin resource sharing (CORS)
   - Click Edit and paste this JSON:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "GET"
        ],
        "AllowedOrigins": [
            "http://localhost:5544"
        ],
        "ExposeHeaders": []
    }
]
```

### Step 2: Create Secure AWS Credentials

1. **Go to AWS IAM Console**: https://console.aws.amazon.com/iam/
2. **Create a new User**:
   - User name: `your-platform-local-dev-user`
   - Select "Provide user access to the AWS Management Console" (optional)
   - Choose "I want to create an IAM user"
3. **Create a Limited Policy**:
   - In Permissions, select "Attach policies directly"
   - Click "Create policy"
   - Switch to JSON tab and paste (replace `your-platform-name-dev` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:GetObjectAcl",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::your-platform-name-dev/*"
        }
    ]
}
```

4. **Generate Access Keys**:
   - After user creation, go to Security credentials tab
   - Click "Create access key"
   - Choose "Command Line Interface (CLI)" use case
   - **Save the Access Key ID and Secret Access Key** (you'll only see the secret once!)

### Step 3: Configure Local Environment

1. **Create `.env.local`** in your project root:

```bash
# AWS Credentials for Local Testing
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET_NAME=your-platform-name-dev
AWS_REGION=us-east-1

# Base URL for SEO structured data
NEXT_PUBLIC_BASE_URL=http://localhost:5544

# Your existing database and auth settings
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_URL=http://localhost:5544
NEXTAUTH_SECRET=your-nextauth-secret-here

# Other environment variables from your .env.example...
```

## Phase 2: Local Testing Workflow

### Step 1: Start Your Development Environment

```bash
# Make sure your database is up to date
npx prisma db push

# Start the development server
npm run dev
```

### Step 2: Test the Complete Flow

1. **Open Browser**: Go to http://localhost:5544
2. **Register/Login**: Create a test user or login with existing credentials
3. **Navigate to Add Listing**: Go to `/add-listing`
4. **Fill Property Details**:
   - Title: "Test Property for Image Upload"
   - Description: "Testing SEO image system"
   - Location: "New York, NY"
   - Price: 500000
   - Property Type: Apartment
5. **Upload Images**:
   - Drag and drop real image files (JPEG, PNG, WebP)
   - Tag them with room types (Kitchen, Living Room, etc.)
   - Wait for upload progress to complete
6. **Submit the Listing**

### Step 3: Verify the Results

#### ✅ Frontend Verification (Browser)
- Open Developer Tools (F12) → Network tab
- Look for PUT requests to `s3.amazonaws.com` with 200 OK status
- Check Console for any error messages

#### ✅ AWS S3 Verification
- Go to your S3 bucket in AWS Console
- You should see processed images with SEO names like:
  - `test-property-kitchen-new-york-1634567890.webp`
  - `test-property-living-room-new-york-1634567891.webp`
- Multiple sizes should be generated (thumbnail, small, medium, large)

#### ✅ Database Verification
```bash
# Open Prisma Studio to view database
npx prisma studio
```
- Check the `ListingImage` table
- Verify records have:
  - Correct `altText` (e.g., "The kitchen in the Test Property for Image Upload in New York, NY")
  - SEO-optimized `originalName`
  - All responsive image URLs (`url_large`, `url_medium`, etc.)
  - Proper `imageSubject` tags

#### ✅ SEO Features Verification
- Check generated structured data in browser source
- Test image sitemap at: http://localhost:5544/api/sitemap-images.xml

## Common Issues and Solutions

### ❌ CORS Errors
**Symptom**: Console shows "CORS policy" error
**Solution**: Double-check CORS configuration in S3 bucket

### ❌ 403 Forbidden on Upload
**Symptom**: Upload fails with 403 error
**Solution**: Verify IAM policy allows PutObject on your bucket

### ❌ Images Not Processing
**Symptom**: Upload succeeds but no images in database
**Solution**: Check server console for Sharp processing errors

### ❌ Environment Variables Not Loading
**Symptom**: "AWS credentials not found" error
**Solution**: Ensure `.env.local` is in project root and restart dev server

## Testing Checklist

- [ ] S3 bucket created with CORS configured
- [ ] IAM user created with limited permissions
- [ ] Access keys generated and saved
- [ ] `.env.local` configured with AWS credentials
- [ ] Development server starts without errors
- [ ] Can navigate to add-listing page
- [ ] Image uploader component renders correctly
- [ ] Can drag and drop images successfully
- [ ] Upload progress shows and completes
- [ ] Can submit listing with images
- [ ] Images appear in S3 bucket with proper names
- [ ] Database has ListingImage records with correct data
- [ ] Image sitemap generates correctly
- [ ] Structured data includes image information

## Security Notes

- ✅ `.env.local` is in `.gitignore` and won't be committed
- ✅ IAM user has minimal permissions (only your dev bucket)
- ✅ CORS only allows localhost origin
- ✅ Presigned URLs expire automatically
- ✅ No AWS credentials in client-side code

## Next Steps After Local Testing

Once local testing works perfectly:
1. Create production S3 bucket with production domain in CORS
2. Create production IAM user with production bucket access
3. Set production environment variables
4. Deploy and test in production environment

## Troubleshooting Commands

```bash
# Check environment variables are loaded
node -e "console.log(process.env.AWS_ACCESS_KEY_ID ? 'AWS keys loaded' : 'AWS keys missing')"

# Test database connection
npx prisma db push

# View database in browser
npx prisma studio

# Check Sharp image processing
node -e "const sharp = require('sharp'); console.log('Sharp loaded successfully');"
```

Happy testing! 🚀
