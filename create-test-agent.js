/**
 * Create Test Agent User Script
 * Creates a test user directly in the database with agent permissions
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAgent() {
  try {
    console.log('🔍 Creating test agent user...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'me@p.pl' }
    });

    if (existingUser) {
      console.log('✅ User already exists. Updating permissions...');
      
      // Update existing user to agent
      const updatedUser = await prisma.user.update({
        where: { email: 'me@p.pl' },
        data: {
          role: 'AGENT',
          subscriptionStatus: 'ACTIVE',
          emailVerified: new Date(),
          stripeCustomerId: 'test_customer_' + Date.now()
        }
      });
      
      console.log('✅ Updated user:', {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionStatus: updatedUser.subscriptionStatus
      });
      
      return;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Get or create agent package
    let agentPackage = await prisma.package.findFirst({
      where: {
        name: { contains: 'Agent' },
        active: true
      }
    });

    if (!agentPackage) {
      console.log('📦 Creating agent package...');
      agentPackage = await prisma.package.create({
        data: {
          name: 'Agent Monthly',
          description: 'Professional real estate agent package',
          price: 4900, // $49.00
          interval: 'month',
          listingsMax: 50,
          features: JSON.stringify([
            'Upload up to 50 listings',
            'Professional image upload',
            'SEO optimization',
            'Advanced analytics'
          ]),
          stripePriceId: 'price_test_agent_monthly_' + Date.now(),
          active: true
        }
      });
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: 'me@p.pl',
        passwordHash: hashedPassword,
        name: 'Test Agent',
        role: 'AGENT',
        subscriptionStatus: 'ACTIVE',
        emailVerified: new Date(),
        stripeCustomerId: 'test_customer_' + Date.now(),
        packageId: agentPackage.id
      }
    });

    console.log('✅ Created test agent:', {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      subscriptionStatus: newUser.subscriptionStatus,
      packageId: newUser.packageId
    });

    console.log('');
    console.log('🎯 You can now login with:');
    console.log('  Email: me@p.pl');
    console.log('  Password: password123');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Login with the credentials above');
    console.log('3. Go to http://localhost:3000/add-listing');
    console.log('4. Test image upload functionality');

  } catch (error) {
    console.error('❌ Error creating test agent:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAgent();
