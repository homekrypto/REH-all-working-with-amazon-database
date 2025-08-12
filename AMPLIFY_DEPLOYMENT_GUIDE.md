# 🚀 AWS Amplify Deployment - Complete Guide

## Status: Ready for Deployment ✅

All code has been committed and pushed to GitHub. The application builds successfully locally.

## Next Steps: Deploy via AWS Amplify Console

### 1. **Open AWS Amplify Console**
- Go to: https://console.aws.amazon.com/amplify/
- Select region: **eu-north-1** (Stockholm) - matches your RDS database
- Click "Create new app" → "Host web app"

### 2. **Connect GitHub Repository**
- Select "GitHub" as git provider
- Authorize AWS Amplify to access your GitHub account
- Repository: `homekrypto/REH-all-working-with-amazon-database`
- Branch: `main`

### 3. **Configure Build Settings**
- Amplify should auto-detect our `amplify.yml` configuration
- Build command: `npm run build` (already configured)
- Output directory: `.next` (already configured)
- Node.js version: 18 or 20

### 4. **Environment Variables (CRITICAL)**
Add these environment variables in Amplify Console:

**Go to: App Settings → Environment Variables**

⚠️ **IMPORTANT**: Use your actual values from the `amplify-env-vars-private.txt` file (not committed to GitHub)

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NODE_ENV` | Set to `production` |
| `NEXTAUTH_SECRET` | Your NextAuth secret key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret |
| `AWS_ACCESS_KEY_ID` | Your AWS access key ID |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret access key |
| `AWS_REGION` | Set to `eu-north-1` |
| `AWS_S3_BUCKET_NAME` | Your S3 bucket name |
| `SMTP_HOST` | Set to `smtp.gmail.com` |
| `SMTP_PORT` | Set to `587` |
| `SMTP_SECURE` | Set to `false` |
| `EMAIL_FROM` | Your email sender address |

### 5. **Deploy**
- Review all settings
- Click "Save and deploy"
- Wait for build to complete (typically 5-10 minutes)

### 6. **Post-Deployment Configuration**

1. **Get your Amplify URL** (e.g., `https://main.d1234567890.amplifyapp.com`)

2. **Update NEXTAUTH_URL**:
   - Go back to Environment Variables in Amplify Console
   - Add: `NEXTAUTH_URL` = `https://your-amplify-domain.com`
   - Redeploy the app

3. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Add your Amplify domain to "Authorized redirect URIs":
     - `https://your-amplify-domain.com/api/auth/callback/google`

4. **Test your application**:
   - User registration/login
   - Property listings
   - Image uploads
   - Stripe payments
   - Email functionality

## Build Configuration Files

- ✅ `amplify.yml` - Build configuration
- ✅ `next.config.ts` - Next.js configuration
- ✅ `package.json` - Build scripts
- ✅ `.env.production.template` - Environment variables template

## Troubleshooting

If deployment fails:

1. **Check build logs** in Amplify Console
2. **Verify all environment variables** are set correctly
3. **Ensure database is accessible** from AWS
4. **Check Prisma schema** is compatible

## Alternative Deployment (if needed)

If Amplify fails, we have prepared:
- `deploy-amplify-cli.sh` - CLI deployment script
- Docker configuration for ECS deployment
- All necessary configuration files

## Success Criteria

✅ Build completes successfully  
✅ Application loads without errors  
✅ User authentication works  
✅ Database connectivity confirmed  
✅ Image uploads to S3 work  
✅ Stripe payments functional  

---

**Ready to deploy!** 🎉

The project is fully prepared and all code has been pushed to GitHub. You can now proceed with the AWS Amplify Console deployment following the steps above.
