import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Checkout session completed:', session.id)

    const userId = session.metadata?.userId
    const packageId = session.metadata?.packageId

    if (!userId || !packageId) {
      console.error('Missing metadata in checkout session:', session.id)
      return
    }

    // Get subscription details
    const subscriptionId = session.subscription as string
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update user subscription status
    await db.$executeRaw`
      UPDATE User 
      SET subscriptionStatus = 'ACTIVE',
          packageId = ${packageId},
          subscriptionEnd = ${new Date((subscription as any).current_period_end * 1000)}
      WHERE id = ${userId}
    `

    // Get user details for email
    const userResult = await db.$queryRaw`
      SELECT email, name, role FROM "User" WHERE id = ${userId} LIMIT 1
    ` as any[]

    if (userResult && userResult[0]) {
      const user = userResult[0]
      
      // Send welcome email for paid subscription
      await emailService.sendWelcomeEmail(user.email, user.name, user.role)
    }

    console.log(`User ${userId} subscription activated successfully`)

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription created:', subscription.id)

    const userId = subscription.metadata?.userId

    if (!userId) {
      console.error('Missing userId in subscription metadata:', subscription.id)
      return
    }

    // Update subscription status
    await db.$executeRaw`
      UPDATE User 
      SET subscriptionStatus = 'ACTIVE',
          subscriptionEnd = ${new Date((subscription as any).current_period_end * 1000)}
      WHERE id = ${userId}
    `

    console.log(`User ${userId} subscription created and activated`)

  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id)

    const userId = subscription.metadata?.userId

    if (!userId) {
      console.error('Missing userId in subscription metadata:', subscription.id)
      return
    }

    let status = 'ACTIVE'
    
    // Map Stripe subscription status to our enum
    switch (subscription.status) {
      case 'active':
        status = 'ACTIVE'
        break
      case 'canceled':
      case 'incomplete_expired':
        status = 'CANCELED'
        break
      case 'past_due':
      case 'unpaid':
        status = 'EXPIRED'
        break
      default:
        status = 'PENDING'
    }

    // Update subscription
    const packageId = subscription.metadata?.packageId
    const targetRole = subscription.metadata?.targetRole
    
    if (packageId && targetRole) {
      // This is an upgrade, update package and role too
      await db.$executeRaw`
        UPDATE User 
        SET subscriptionStatus = ${status},
            subscriptionEnd = ${new Date((subscription as any).current_period_end * 1000)},
            packageId = ${packageId},
            role = ${targetRole}
        WHERE id = ${userId}
      `
      console.log(`User ${userId} upgraded to ${targetRole} with package ${packageId}`)
    } else {
      // Regular subscription update
      await db.$executeRaw`
        UPDATE User 
        SET subscriptionStatus = ${status},
            subscriptionEnd = ${new Date((subscription as any).current_period_end * 1000)}
        WHERE id = ${userId}
      `
    }

    console.log(`User ${userId} subscription updated to ${status}`)

  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id)

    const userId = subscription.metadata?.userId

    if (!userId) {
      console.error('Missing userId in subscription metadata:', subscription.id)
      return
    }

    // Update subscription status to canceled
    await db.$executeRaw`
      UPDATE User 
      SET subscriptionStatus = 'CANCELED',
          subscriptionEnd = ${new Date((subscription as any).ended_at! * 1000)}
      WHERE id = ${userId}
    `

    console.log(`User ${userId} subscription canceled`)

  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment succeeded:', invoice.id)

    if ((invoice as any).subscription) {
      const stripe = getStripe()
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string)
      const userId = (subscription as any).metadata?.userId

      if (userId) {
        // Ensure subscription is active
        await db.$executeRaw`
          UPDATE User 
          SET subscriptionStatus = 'ACTIVE',
              subscriptionEnd = ${new Date((subscription as any).current_period_end * 1000)}
          WHERE id = ${userId}
        `

        console.log(`User ${userId} subscription renewed via payment`)
      }
    }

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment failed:', invoice.id)

    if ((invoice as any).subscription) {
      const stripe = getStripe()
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string)
      const userId = (subscription as any).metadata?.userId

      if (userId) {
        // Mark subscription as expired due to payment failure
        await db.$executeRaw`
          UPDATE User 
          SET subscriptionStatus = 'EXPIRED'
          WHERE id = ${userId}
        `

        console.log(`User ${userId} subscription marked as expired due to payment failure`)

        // Get user details for notification email
        const userResult = await db.$queryRaw`
          SELECT email, name FROM "User" WHERE id = ${userId} LIMIT 1
        ` as any[]

        if (userResult && userResult[0]) {
          const user = userResult[0]
          
          // TODO: Send payment failed email notification
          console.log(`Should send payment failed email to ${user.email}`)
        }
      }
    }

  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}
