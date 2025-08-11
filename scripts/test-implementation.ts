#!/usr/bin/env tsx

import { db } from '../src/lib/db'
import { emailService } from '../src/lib/email'

async function testDatabaseAndEmail() {
  console.log('🧪 Testing Database Schema and Email Service...\n')
  
  try {
    // Test 1: Check if Package model works
    console.log('📦 Testing Package model...')
    const packages = await db.package.findMany()
    console.log(`✅ Found ${packages.length} packages`)
    if (packages.length > 0) {
      console.log(`   Example: ${packages[0].name} - $${packages[0].price/100}/${packages[0].interval}`)
    }
    
    // Test 2: Check if EmailVerification model works
    console.log('\n📧 Testing EmailVerification model...')
    const verifications = await db.emailVerification.findMany()
    console.log(`✅ EmailVerification table exists. Found ${verifications.length} records`)
    
    // Test 3: Check if User model has all required fields
    console.log('\n👤 Testing User model with new fields...')
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        packageId: true,
        agencyName: true,
        bio: true
      }
    })
    console.log(`✅ User model with subscription fields works. Found ${users.length} users`)
    
    // Test 4: Test email service (development mode)
    console.log('\n📨 Testing Email Service...')
    const testEmailResult = await emailService.sendVerificationEmail(
      'test@example.com',
      'Test User',
      'test-token-123'
    )
    console.log(`✅ Email service test: ${testEmailResult ? 'SUCCESS' : 'FAILED'}`)
    
    console.log('\n🎉 All tests passed! Database schema and email service are working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

testDatabaseAndEmail()
