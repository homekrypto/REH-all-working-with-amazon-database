import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, targetRole, priceId, currentRole, email, packageId } = await request.json()

    // Validate that the user can upgrade to this role
    const validUpgrades: Record<string, string[]> = {
      USER: ['AGENT', 'EXPERT'],
      AGENT: ['EXPERT'],
      EXPERT: []
    }

    if (!validUpgrades[currentRole]?.includes(targetRole)) {
      return NextResponse.json({ 
        error: 'Invalid upgrade path' 
      }, { status: 400 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?upgrade_cancelled=true`,
      customer_email: email,
      metadata: {
        userId: userId,
        currentRole: currentRole,
        targetRole: targetRole,
        upgradeType: 'role_upgrade',
        packageId: packageId || ''
      },
      subscription_data: {
        metadata: {
          userId: userId,
          currentRole: currentRole,
          targetRole: targetRole,
          upgradeType: 'role_upgrade',
          packageId: packageId || ''
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      url: checkoutSession.url 
    })

  } catch (error) {
    console.error('Error creating upgrade checkout session:', error)
    return NextResponse.json({ 
      error: 'Failed to create upgrade session' 
    }, { status: 500 })
  }
}
