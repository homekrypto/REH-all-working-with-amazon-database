#!/bin/bash

# Set environment variables for REH-production Elastic Beanstalk environment
# Update these values with your actual credentials before running

ENVIRONMENT_NAME="REH-production"
REGION="eu-north-1"

echo "Setting environment variables for $ENVIRONMENT_NAME..."

# Core application settings
aws elasticbeanstalk update-environment \
  --environment-name "$ENVIRONMENT_NAME" \
  --region "$REGION" \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=PORT,Value=8080 \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=NEXTAUTH_URL,Value=https://REH-production.eba-f4x2tixm.eu-north-1.elasticbeanstalk.com

echo "Basic environment variables set. Please update the script with your actual credentials and run again to set:"
echo "- DATABASE_URL"
echo "- NEXTAUTH_SECRET"
echo "- STRIPE_PUBLIC_KEY"
echo "- STRIPE_SECRET_KEY"
echo "- STRIPE_WEBHOOK_SECRET"
echo "- AWS_ACCESS_KEY_ID"
echo "- AWS_SECRET_ACCESS_KEY"
echo "- S3_BUCKET_NAME"
echo "- Email settings (if needed)"

# Uncomment and update these lines with your actual values:
# aws elasticbeanstalk update-environment \
#   --environment-name "$ENVIRONMENT_NAME" \
#   --region "$REGION" \
#   --option-settings \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=DATABASE_URL,Value="your_postgresql_connection_string" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=NEXTAUTH_SECRET,Value="your_nextauth_secret" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=STRIPE_PUBLIC_KEY,Value="your_stripe_public_key" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=STRIPE_SECRET_KEY,Value="your_stripe_secret_key" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=STRIPE_WEBHOOK_SECRET,Value="your_stripe_webhook_secret" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=AWS_ACCESS_KEY_ID,Value="your_aws_access_key" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=AWS_SECRET_ACCESS_KEY,Value="your_aws_secret_key" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=AWS_REGION,Value="eu-north-1" \
#     Namespace=aws:elasticbeanstalk:application:environment,OptionName=S3_BUCKET_NAME,Value="your_s3_bucket_name"
