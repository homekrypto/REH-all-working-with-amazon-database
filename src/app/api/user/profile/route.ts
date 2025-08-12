import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user data using raw query to avoid TypeScript issues
    const userResult = await db.$queryRaw`
      SELECT 
        id, 
        email, 
        name, 
        role, 
        "subscriptionStatus", 
        "packageId", 
        "subscriptionEnd",
        "emailVerified",
        "stripeCustomerId"
      FROM "User" 
      WHERE email = ${session.user.email} 
      LIMIT 1
    ` as any[]

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult[0]

    // Get package details if user has one
    let packageInfo = null
    if (user.packageId) {
      const packageResult = await db.$queryRaw`
        SELECT id, name, description, price, interval, "listingsMax", features
        FROM "Package" 
        WHERE id = ${user.packageId} 
        LIMIT 1
      ` as any[]
      
      if (packageResult && packageResult.length > 0) {
        packageInfo = {
          ...packageResult[0],
          features: JSON.parse(packageResult[0].features)
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        packageId: user.packageId,
        subscriptionEnd: user.subscriptionEnd,
        emailVerified: user.emailVerified,
        package: packageInfo
      }
    })

  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
