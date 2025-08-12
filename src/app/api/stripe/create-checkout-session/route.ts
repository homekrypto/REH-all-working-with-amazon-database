import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// Initialize Stripe only when we have the secret key
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-07-30.basil',
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from email since TypeScript types aren't updated
    const userIdResult = await db.$queryRaw`
      SELECT id FROM "User" WHERE email = ${session.user.email} LIMIT 1
    ` as any[]

    const userId = userIdResult[0]?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const { packageId, successUrl, cancelUrl } = await request.json()

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    // Get user from database using raw query
    const userResult = await db.$queryRaw`
      SELECT id, email, name, role, "stripeCustomerId", "emailVerified" 
      FROM "User" WHERE id = ${userId} LIMIT 1
    ` as any[]

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult[0]

    // Check if user's email is verified
    if (!user.email) {
      return NextResponse.json(
        { error: 'Email verification required before subscription' },
        { status: 400 }
      )
    }

    // Get package details using raw query due to TypeScript issues
    const packageResult = await db.$queryRaw`
      SELECT * FROM "Package" WHERE id = ${packageId} AND active = true LIMIT 1
    ` as any[]

    if (!packageResult || packageResult.length === 0) {
      return NextResponse.json(
        { error: 'Package not found or inactive' },
        { status: 404 }
      )
    }

    const selectedPackage = packageResult[0]

    // Validate role-package compatibility
    if (user.role === 'AGENT' && !selectedPackage.name.toLowerCase().includes('agent')) {
      return NextResponse.json(
        { error: 'Selected package is not compatible with Agent role' },
        { status: 400 }
      )
    }
    
    if (user.role === 'EXPERT' && !selectedPackage.name.toLowerCase().includes('expert')) {
      return NextResponse.json(
        { error: 'Selected package is not compatible with Expert role' },
        { status: 400 }
      )
    }

    // Get Stripe instance
    const stripe = getStripe()
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
          role: user.role
        }
      })
      
      customerId = customer.id
      
      // Update user with Stripe customer ID using raw query
      await db.$executeRaw`
        UPDATE User SET stripeCustomerId = ${customerId} WHERE id = ${user.id}
      `
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPackage.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        packageId: selectedPackage.id,
        userRole: user.role
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          packageId: selectedPackage.id,
          userRole: user.role
        }
      },
      customer_update: {
        name: 'auto',
        address: 'auto',
      },
      tax_id_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
