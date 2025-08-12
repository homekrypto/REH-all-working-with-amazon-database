#!/bin/bash

# Check GitHub Secrets Status
# This script helps verify if all required secrets are set

echo "🔍 GitHub Secrets Status Check"
echo "============================="
echo ""

# List of required secrets
REQUIRED_SECRETS=(
    "DATABASE_URL"
    "NODE_ENV" 
    "NEXTAUTH_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_REGION"
    "AWS_S3_BUCKET_NAME"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_SECURE"
    "SMTP_USER"
    "SMTP_PASS"
    "EMAIL_FROM"
)

echo "📋 Required secrets for deployment:"
for secret in "${REQUIRED_SECRETS[@]}"; do
    echo "   ✓ $secret"
done

echo ""
echo "🔐 Have you added all these secrets to GitHub?"
echo "   Go to: https://github.com/homekrypto/REH-all-working-with-amazon-database/settings/secrets/actions"
echo ""
echo "✅ When all secrets are added, run:"
echo "   ./trigger-deployment.sh"
echo ""
echo "📊 You can monitor the deployment at:"
echo "   https://github.com/homekrypto/REH-all-working-with-amazon-database/actions"
