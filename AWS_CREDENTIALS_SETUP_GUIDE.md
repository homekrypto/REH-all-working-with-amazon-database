🔑 AWS Credentials Setup Guide for Account 993249066711
==========================================================

Follow these steps to get your AWS credentials:

📋 Step 1: Login to AWS Console
------------------------------
1. Go to: https://console.aws.amazon.com/
2. Login to account: 993249066711
3. Make sure you're in the correct account (check top-right corner)

📋 Step 2: Navigate to IAM
-------------------------
1. In the AWS Console search bar, type "IAM"
2. Click on "IAM" service
3. In the left sidebar, click "Users"

📋 Step 3: Find/Create Your User
-------------------------------
Option A - If you have an existing IAM user:
1. Click on your existing IAM user
2. Go to "Security credentials" tab
3. Scroll down to "Access keys" section

Option B - If you need to create a new IAM user:
1. Click "Create user"
2. Enter username (e.g., "developer" or your name)
3. Select "Programmatic access"
4. Attach policies: "AmazonS3FullAccess" (minimum required)
5. Complete the wizard

📋 Step 4: Create Access Keys
----------------------------
1. In the "Access keys" section, click "Create access key"
2. Select "Command Line Interface (CLI)"
3. Check the confirmation box
4. Optionally add a description tag
5. Click "Create access key"

📋 Step 5: Copy Your Credentials
-------------------------------
⚠️  IMPORTANT: Copy these immediately - the secret key won't be shown again!

You'll see:
- Access key ID: (starts with AKIA...)
- Secret access key: (long random string)

📋 Step 6: Configure AWS CLI
---------------------------
Run this command in your terminal:

    aws configure --profile myaccount

When prompted, enter:
- AWS Access Key ID: [paste the Access key ID from step 5]
- AWS Secret Access Key: [paste the Secret access key from step 5]
- Default region name: eu-north-1
- Default output format: json

📋 Step 7: Verify Configuration
------------------------------
Test that it's working:

    aws sts get-caller-identity --profile myaccount

You should see account: "993249066711"

📋 Step 8: Create S3 Bucket
--------------------------
Once configured, run:

    ./create-s3-bucket-correct-account.sh

🔒 Security Notes:
- Never share your secret access key
- Store credentials securely
- Consider using IAM roles in production
- You can always create new access keys if needed
