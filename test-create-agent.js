const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestAgent() {
  console.log('🧪 Creating test agent user...\n');

  try {
    // First, let's see if there are any existing users
    const existingUsers = await prisma.user.findMany();
    console.log(`Found ${existingUsers.length} existing users:`);
    existingUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    console.log('');

    // Create a test agent user
    const testUser = await prisma.user.create({
      data: {
        email: 'testagent@example.com',
        name: 'Test Agent',
        role: 'AGENT',
        subscriptionStatus: 'ACTIVE',
        emailVerified: new Date(),
        passwordHash: 'test123' // In real app, this would be hashed
      }
    });

    console.log('✅ Created test agent:');
    console.log(`- ID: ${testUser.id}`);
    console.log(`- Email: ${testUser.email}`);
    console.log(`- Name: ${testUser.name}`);
    console.log(`- Role: ${testUser.role}`);
    console.log(`- Subscription: ${testUser.subscriptionStatus}`);
    console.log('');

    // Create a test session for the user
    const testSession = await prisma.session.create({
      data: {
        sessionToken: 'test-session-token-123',
        userId: testUser.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
    });

    console.log('✅ Created test session:');
    console.log(`- Session Token: ${testSession.sessionToken}`);
    console.log(`- User ID: ${testSession.userId}`);
    console.log(`- Expires: ${testSession.expires}`);
    console.log('');

    // Test the middleware role check logic
    console.log('🛡️ Testing middleware role check:');
    const userRole = testUser.role;
    const allowedRoles = ['AGENT', 'EXPERT', 'agent', 'admin'];
    const isAllowed = userRole && allowedRoles.includes(userRole);
    
    console.log(`User role: ${userRole}`);
    console.log(`Allowed roles: ${allowedRoles.join(', ')}`);
    console.log(`Access to /add-listing: ${isAllowed ? '✅ ALLOWED' : '❌ DENIED'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAgent();
