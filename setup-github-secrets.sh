#!/bin/bash

# GitHub Secrets Setup Guide for Amplify Deployment
# This script helps you set up the required GitHub secrets

echo "🔐 GitHub Secrets Setup for AWS Amplify Deployment"
echo "=================================================="
echo ""
echo "You need to add these secrets to your GitHub repository:"
echo "Go to: https://github.com/homekrypto/REH-all-working-with-amazon-database/settings/secrets/actions"
echo ""

# Read actual values from private env file
if [ -f "amplify-env-vars-private.txt" ]; then
    echo "📄 Reading values from amplify-env-vars-private.txt..."
    echo ""
    
    # Extract values and format for GitHub secrets
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! "$key" =~ ^[[:space:]]*# ]] && [[ -n "$key" ]] && [[ -n "$value" ]]; then
            echo "Secret Name: $key"
            echo "Secret Value: $value"
            echo "---"
        fi
    done < amplify-env-vars-private.txt
    
else
    echo "⚠️  amplify-env-vars-private.txt not found. Using template values:"
    echo ""
    echo "Add these secrets to GitHub:"
    echo ""
    
    # Template secrets list
    cat << 'EOF'
DATABASE_URL
└─ Your PostgreSQL connection string

NEXTAUTH_SECRET  
└─ Your NextAuth secret key

NEXTAUTH_URL
└─ Will be set after deployment (e.g., https://main.abc123.amplifyapp.com)

GOOGLE_CLIENT_ID
└─ Your Google OAuth client ID

GOOGLE_CLIENT_SECRET
└─ Your Google OAuth client secret

STRIPE_PUBLISHABLE_KEY
└─ Your Stripe publishable key

STRIPE_SECRET_KEY
└─ Your Stripe secret key

STRIPE_WEBHOOK_SECRET
└─ Your Stripe webhook secret

AWS_ACCESS_KEY_ID
└─ Your AWS access key ID

AWS_SECRET_ACCESS_KEY
└─ Your AWS secret access key

AWS_REGION
└─ eu-north-1

AWS_S3_BUCKET_NAME
└─ Your S3 bucket name

SMTP_HOST
└─ smtp.gmail.com

SMTP_PORT
└─ 587

SMTP_SECURE
└─ false

SMTP_USER
└─ Your email address

SMTP_PASS
└─ Your email app password

EMAIL_FROM
└─ Real Estate Platform <noreply@realestateplatform.com>

AMPLIFY_APP_ID (Optional)
└─ If you have an existing Amplify app ID
EOF
fi

echo ""
echo "📝 Steps to add secrets:"
echo "1. Go to: https://github.com/homekrypto/REH-all-working-with-amazon-database/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Add each secret name and value"
echo "4. Click 'Add secret'"
echo ""
echo "🚀 After adding secrets, push any commit to trigger deployment!"
echo ""

# Open GitHub secrets page if possible
if command -v open &> /dev/null; then
    echo "🌐 Opening GitHub secrets page..."
    open "https://github.com/homekrypto/REH-all-working-with-amazon-database/settings/secrets/actions"
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening GitHub secrets page..."
    xdg-open "https://github.com/homekrypto/REH-all-working-with-amazon-database/settings/secrets/actions"
fi
