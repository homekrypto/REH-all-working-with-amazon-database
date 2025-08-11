// Test user database access and password verification
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const testUserAuth = async () => {
  console.log('🔍 Testing user authentication database access...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Check if user exists in database
    console.log('\n1️⃣ Checking if test user exists...');
    const user = await prisma.user.findFirst({ 
      where: { email: 'me@p.pl' } 
    });
    
    if (!user) {
      console.log('❌ Test user does not exist in database!');
      console.log('Creating test user...');
      
      const hashedPassword = await bcrypt.hash('testpassword123', 12);
      const newUser = await prisma.user.create({
        data: {
          email: 'me@p.pl',
          name: 'Test User',
          passwordHash: hashedPassword,
          role: 'USER',
          emailVerified: new Date()
        }
      });
      console.log('✅ Test user created:', newUser.email);
    } else {
      console.log('✅ Test user exists:', user.email);
      console.log('User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        hasPassword: !!user.passwordHash
      });
      
      // Test 2: Verify password
      if (user.passwordHash) {
        console.log('\n2️⃣ Testing password verification...');
        const passwordValid = await bcrypt.compare('testpassword123', user.passwordHash);
        console.log('Password valid:', passwordValid);
      } else {
        console.log('❌ User has no password hash!');
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

testUserAuth();
