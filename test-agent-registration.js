// Test script for agent registration flow
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAgentRegistration() {
  console.log('🚀 Testing Agent Registration Flow...\n');

  try {
    // Step 1: Test packages API
    console.log('1. Testing packages API...');
    const packagesResponse = await axios.get(`${BASE_URL}/api/packages`);
    console.log('✅ Packages loaded:', packagesResponse.data.packages?.length || 0);
    
    const agentPackages = packagesResponse.data.packages?.filter(pkg => 
      pkg.name.toLowerCase().includes('agent')
    ) || [];
    console.log('📦 Agent packages available:', agentPackages.map(p => p.name));

    // Step 2: Test agent registration
    console.log('\n2. Testing agent registration...');
    const registrationData = {
      name: 'Test Agent User',
      email: `testagent${Date.now()}@example.com`,
      password: 'testpassword123',
      confirmPassword: 'testpassword123',
      phone: '+1234567890',
      agencyName: 'Test Real Estate Agency',
      bio: 'Experienced real estate agent specializing in residential properties',
      role: 'AGENT',
      packageId: agentPackages[0]?.id // Use first agent package
    };

    console.log('📝 Registration payload:', {
      ...registrationData,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]'
    });

    const registrationResponse = await axios.post(
      `${BASE_URL}/api/auth/register`,
      registrationData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Registration response:', registrationResponse.data);

    // Step 3: Test with expert role
    console.log('\n3. Testing expert registration...');
    const expertPackages = packagesResponse.data.packages?.filter(pkg => 
      pkg.name.toLowerCase().includes('expert')
    ) || [];
    console.log('📦 Expert packages available:', expertPackages.map(p => p.name));

    const expertRegistrationData = {
      name: 'Test Expert User',
      email: `testexpert${Date.now()}@example.com`,
      password: 'testpassword123',
      confirmPassword: 'testpassword123',
      phone: '+1234567890',
      agencyName: 'Premium Real Estate Experts',
      bio: 'Real estate expert with 15+ years of experience',
      role: 'EXPERT',
      packageId: expertPackages[0]?.id // Use first expert package
    };

    const expertRegistrationResponse = await axios.post(
      `${BASE_URL}/api/auth/register`,
      expertRegistrationData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Expert registration response:', expertRegistrationResponse.data);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAgentRegistration();
