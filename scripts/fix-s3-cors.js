#!/usr/bin/env node

const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

async function fixS3Cors() {
  console.log('🔧 Configuring S3 CORS settings...');
  
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: [
          'http://localhost:5544',
          'https://localhost:5544',
          'http://127.0.0.1:5544',
          'http://localhost:3000', // backup for standard Next.js port
          'https://localhost:3000'
        ],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  try {
    const command = new PutBucketCorsCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    });

    await s3Client.send(command);
    console.log('✅ S3 CORS configuration updated successfully!');
    console.log('📝 CORS rules applied:');
    console.log('   - Allowed Origins: http://localhost:5544, https://localhost:5544');
    console.log('   - Allowed Methods: GET, PUT, POST, DELETE, HEAD');
    console.log('   - Allowed Headers: *');
    console.log('');
    console.log('🚀 Your image uploads should now work!');
    
  } catch (error) {
    console.error('❌ Error configuring S3 CORS:', error.message);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('1. Check your AWS credentials are correct');
    console.log('2. Ensure your AWS user has s3:PutBucketCors permissions');
    console.log('3. Verify the bucket name is correct');
    console.log('');
    console.log('📋 Manual CORS Configuration:');
    console.log('If this script fails, manually configure CORS in AWS S3 Console:');
    console.log('https://s3.console.aws.amazon.com/');
    console.log('');
    console.log('Use this CORS configuration:');
    console.log(JSON.stringify(corsConfiguration.CORSRules, null, 2));
  }
}

if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  fixS3Cors();
}

module.exports = { fixS3Cors };
