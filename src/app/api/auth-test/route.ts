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
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
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
