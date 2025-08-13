import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get all environment variables
    const allEnvKeys = Object.keys(process.env)
    const amplifyEnvKeys = allEnvKeys.filter(key => key.includes('AMPLIFY') || key.includes('AWS'))
    const nextAuthKeys = allEnvKeys.filter(key => key.includes('NEXTAUTH'))
    
    // Test critical environment variables
    const criticalVars = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    }

    const diagnostics = {
      status: 'runtime_environment_check',
      timestamp: new Date().toISOString(),
      totalEnvVars: allEnvKeys.length,
      amplifyVars: amplifyEnvKeys.length,
      nextAuthVars: nextAuthKeys.length,
      
      // Environment variable availability
      envVarStatus: Object.entries(criticalVars).reduce((acc, [key, value]) => {
        acc[key] = {
          exists: !!value,
          hasValue: value ? value.length > 0 : false,
          preview: value ? `${value.substring(0, 10)}...` : 'MISSING'
        }
        return acc
      }, {} as Record<string, any>),
      
      // Runtime environment info
      runtimeInfo: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        amplifyAppId: process.env.AWS_AMPLIFY_APP_ID || 'NOT_SET',
        amplifyBranch: process.env.AWS_AMPLIFY_BRANCH || 'NOT_SET',
        amplifyRegion: process.env.AWS_REGION || 'NOT_SET'
      },
      
      // Sample of available environment variables (first 20)
      availableEnvVars: allEnvKeys.slice(0, 20),
      amplifySpecificVars: amplifyEnvKeys,
      nextAuthSpecificVars: nextAuthKeys
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Runtime diagnostics failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
