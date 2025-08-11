import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Retrieve the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'line_items']
    })

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Extract upgrade details
    const subscription = typeof checkoutSession.subscription === 'string' ? 
      checkoutSession.subscription : 
      checkoutSession.subscription

    const details = {
      newRole: checkoutSession.metadata?.targetRole,
      previousRole: checkoutSession.metadata?.currentRole,
      amount: checkoutSession.amount_total ? (checkoutSession.amount_total / 100).toFixed(2) : null,
      currency: checkoutSession.currency?.toUpperCase(),
      billingPeriod: checkoutSession.subscription ? 
        (checkoutSession.line_items?.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly') : 
        'one-time',
      customerEmail: checkoutSession.customer_email,
      subscriptionId: typeof subscription === 'string' ? subscription : subscription?.id
    }

    return NextResponse.json({ 
      success: true, 
      details 
    })

  } catch (error) {
    console.error('Error fetching upgrade session:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch upgrade details' 
    }, { status: 500 })
  }
}
