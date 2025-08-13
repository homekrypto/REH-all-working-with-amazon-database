import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const config = {
      NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET_EXISTS: !!process.env.GOOGLE_CLIENT_SECRET,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      S3_ACCESS_KEY_ID_EXISTS: !!process.env.S3_ACCESS_KEY_ID,
      S3_REGION_EXISTS: !!process.env.S3_REGION,
      S3_BUCKET_NAME_EXISTS: !!process.env.S3_BUCKET_NAME,
      STRIPE_SECRET_KEY_EXISTS: !!process.env.STRIPE_SECRET_KEY,
      NODE_ENV: process.env.NODE_ENV,
      ENV_KEYS_COUNT: Object.keys(process.env).length,
      timestamp: new Date().toISOString(),
      // Debug: Show first few chars of actual values (safe)
      NEXTAUTH_SECRET_PREVIEW: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 8) + '...' : 'MISSING',
      DATABASE_URL_PREVIEW: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'MISSING'
    }

    return NextResponse.json({
      status: 'success',
      message: 'Auth configuration test',
      config
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Auth test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
