/**
 * Test User Setup Script
 * Updates me@p.pl user with payment success status for testing
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupTestUser() {
  try {
    console.log('🔍 Looking for user me@p.pl...');
    
    // Find the user
    let user = await prisma.user.findUnique({
      where: { email: 'me@p.pl' },
      include: { package: true }
    });

    if (!user) {
      console.log('❌ User me@p.pl not found. Please register first.');
      return;
    }

    console.log('✅ Found user:', {
      id: user.id,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      emailVerified: user.emailVerified
    });

    // Get an agent package to assign
    let agentPackage = await prisma.package.findFirst({
      where: {
        name: { contains: 'Agent' },
        active: true
      }
    });

    if (!agentPackage) {
      console.log('📦 No agent package found. Creating one...');
      agentPackage = await prisma.package.create({
        data: {
          name: 'Agent Monthly',
          description: 'Professional real estate agent package',
          price: 4900, // $49.00
          interval: 'month',
          listingsMax: 50,
          features: JSON.stringify({
            "support": "email",
            "analytics": true,
            "marketing": true,
            "crm": true
          }),
          stripePriceId: 'price_test_agent_monthly',
          active: true
        }
      });
      console.log('✅ Created agent package:', agentPackage.name);
    }

    // Hash password for test user
    const testPassword = 'testpassword123';
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // Update user with payment success
    const updatedUser = await prisma.user.update({
      where: { email: 'me@p.pl' },
      data: {
        role: 'AGENT',
        subscriptionStatus: 'ACTIVE',
        emailVerified: new Date(),
        packageId: agentPackage.id,
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        stripeCustomerId: 'cus_test_' + user.id.slice(-8),
        passwordHash: passwordHash // Set password for login testing
      },
      include: { package: true }
    });

    console.log('🎉 Successfully updated user:');
    console.log({
      email: updatedUser.email,
      role: updatedUser.role,
      subscriptionStatus: updatedUser.subscriptionStatus,
      emailVerified: updatedUser.emailVerified,
      packageName: updatedUser.package?.name,
      subscriptionEnd: updatedUser.subscriptionEnd
    });

    console.log('');
    console.log('✅ User me@p.pl is now ready for testing!');
    console.log('📋 Test Details:');
    console.log('   - Email: me@p.pl');
    console.log('   - Password: testpassword123');
    console.log('   - Role: AGENT');
    console.log('   - Status: ACTIVE subscription');
    console.log('   - Email verified: YES');
    console.log('   - Package:', updatedUser.package?.name);
    console.log('');
    console.log('🚀 You can now log in at: http://localhost:3000/auth/login');

  } catch (error) {
    console.error('❌ Error setting up test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupTestUser().catch(console.error);
}

module.exports = { setupTestUser };
