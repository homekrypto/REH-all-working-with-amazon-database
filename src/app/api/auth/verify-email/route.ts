import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the email verification record
    const verification = await db.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired (24 hours)
    const now = new Date()
    const tokenAge = now.getTime() - verification.createdAt.getTime()
    const hoursAge = tokenAge / (1000 * 60 * 60)

    if (hoursAge > 24) {
      // Delete expired token
      await db.emailVerification.delete({
        where: { id: verification.id }
      })
      
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if email is already verified
    if (verification.user.emailVerified) {
      // Clean up the verification record
      await db.emailVerification.delete({
        where: { id: verification.id }
      })
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Email is already verified',
          alreadyVerified: true
        },
        { status: 200 }
      )
    }

    // Update user's email verification status
    const user = await db.user.update({
      where: { id: verification.userId },
      data: {
        emailVerified: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionStatus: true,
        packageId: true
      }
    })

    // Delete the verification record
    await db.emailVerification.delete({
      where: { id: verification.id }
    })

    // Send welcome email
    if (user.email) {
      await emailService.sendWelcomeEmail(user.email, user.name || '', user.role)
    }

    // Determine next steps based on user type
    let nextStep = '/dashboard'
    let needsPayment = false

    if (user.role !== 'USER' && user.subscriptionStatus === 'PENDING') {
      needsPayment = true
      nextStep = '/complete-registration'
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully!',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus
        },
        needsPayment,
        nextStep
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Delete any existing verification tokens for this user
    await db.emailVerification.deleteMany({
      where: { userId: user.id }
    })

    // Generate new verification token
    const token = crypto.randomUUID()

    // Create new verification record
    await db.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(user.email!, user.name!, token)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
