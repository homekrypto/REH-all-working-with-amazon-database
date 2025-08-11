const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('🔧 Connecting to database...')
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' }
    })
    
    if (existingUser) {
      console.log('⚠️  Test user already exists!')
      console.log('📧 Email: testuser@example.com')
      console.log('🔑 Password: testuser123')
      console.log('👤 Role:', existingUser.role)
      console.log('✅ You can use these credentials to login')
      return
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash('testuser123', 12)
    
    // Create the test user
    const user = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        name: 'Test User',
        passwordHash: passwordHash,
        role: 'USER',
        subscriptionStatus: 'FREE',
        emailVerified: new Date(), // Auto-verify for testing
        phone: '+1 (555) 123-0001',
      }
    })
    
    console.log('✅ Test user created successfully!')
    console.log('')
    console.log('🎯 TEST USER CREDENTIALS:')
    console.log('📧 Email: testuser@example.com')
    console.log('🔑 Password: testuser123')
    console.log('👤 Role: USER')
    console.log('💳 Subscription: FREE')
    console.log('✉️  Email Verified: Yes')
    console.log('')
    console.log('🚀 READY TO TEST!')
    console.log('1. Go to http://localhost:5544/auth/login')
    console.log('2. Login with the credentials above')
    console.log('3. You will be redirected to /dashboard')
    console.log('4. Test USER role features')
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message)
    
    if (error.code === 'P2002') {
      console.log('⚠️  User with this email already exists')
      console.log('✅ You can use: testuser@example.com / testuser123')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
