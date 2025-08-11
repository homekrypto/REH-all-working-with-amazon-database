# 🚀 Quick AWS Setup for Local Testing

## 1. Create S3 Bucket (5 minutes)
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Name: `real-estate-images` (your actual bucket name)
4. Region: `us-east-1`
5. ⚠️ **UNCHECK** "Block all public access"
6. Click "Create bucket"

## 2. Configure CORS (2 minutes)
1. Open your new bucket
2. Go to "Permissions" tab
3. Scroll to "Cross-origin resource sharing (CORS)"
4. Click "Edit" and paste:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET"],
        "AllowedOrigins": ["http://localhost:5544"],
        "ExposeHeaders": []
    }
]
```

## 3. Create IAM User (5 minutes)
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Username: `your-platform-local-dev-user`
4. Click "Next"
5. Select "Attach policies directly"
6. Click "Create policy"
7. Switch to "JSON" tab and paste (replace bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::real-estate-images/*"
        }
    ]
}
```

8. Name the policy: `YourPlatformLocalDevS3Access`
9. Create policy and attach to user
10. Create user

## 4. Generate Access Keys (2 minutes)
1. Click on your new user
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Choose "Command Line Interface (CLI)"
5. Check the confirmation checkbox
6. Click "Create access key"
7. **COPY BOTH VALUES** (you'll only see the secret once!)

## 5. Update .env.local (1 minute)
Replace these values in your `.env.local`:

```bash
AWS_ACCESS_KEY_ID=AKIA...your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=real-estate-images
AWS_REGION=us-east-1
```

## 6. Test! 🎉
```bash
npm run dev
```

Then go to: http://localhost:5544/add-listing

---

**Total time: ~15 minutes** ⏱️

**💡 Pro tip**: Keep your AWS credentials secure - `.env.local` is already in `.gitignore`
