import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { 
      email, 
      password, 
      name, 
      role = 'USER', 
      phone, 
      agencyName, 
      bio,
      packageId 
    } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['USER', 'AGENT', 'EXPERT'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // For paid roles, validate that a package is selected
    if (role !== 'USER' && !packageId) {
      return NextResponse.json(
        { error: 'Package selection is required for Agent and Expert accounts' },
        { status: 400 }
      )
    }

    // Validate package exists if provided
    if (packageId) {
      const packageExists = await db.package.findUnique({
        where: { id: packageId, active: true }
      })
      
      if (!packageExists) {
        return NextResponse.json(
          { error: 'Invalid package selected' },
          { status: 400 }
        )
      }

      // Validate role-package compatibility
      if (role === 'AGENT' && !packageId.includes('agent')) {
        return NextResponse.json(
          { error: 'Selected package is not compatible with Agent role' },
          { status: 400 }
        )
      }
      
      if (role === 'EXPERT' && !packageId.includes('expert')) {
        return NextResponse.json(
          { error: 'Selected package is not compatible with Expert role' },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine subscription status
    let subscriptionStatus = 'FREE'
    if (role !== 'USER') {
      subscriptionStatus = 'PENDING' // Will be changed to ACTIVE after payment
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: role as 'USER' | 'AGENT' | 'EXPERT',
        phone: phone || null,
        agencyName: (role !== 'USER' && agencyName) ? agencyName : null,
        bio: (role !== 'USER' && bio) ? bio : null,
        packageId: packageId || null,
        subscriptionStatus: subscriptionStatus as 'FREE' | 'PENDING' | 'ACTIVE' | 'CANCELED' | 'EXPIRED',
        emailVerified: null, // Email verification to be implemented
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        agencyName: true,
        bio: true,
        packageId: true,
        subscriptionStatus: true,
        createdAt: true,
      }
    })

    // TODO: Send email verification email
    // TODO: For paid users, redirect to payment flow

    // Generate email verification token
    const verificationToken = uuidv4()

    // Create email verification record
    await db.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(user.email!, user.name!, verificationToken)

    if (!emailSent) {
      console.error('Failed to send verification email for user:', user.email)
      // Don't fail registration, just log the error
    }

    const message = role === 'USER' 
      ? 'Free account created successfully! You can now sign in.'
      : 'Account created successfully! Please check your email to verify your account and complete the payment process.'

    return NextResponse.json(
      { 
        success: true,
        message,
        user,
        needsPayment: role !== 'USER',
        needsEmailVerification: true
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
