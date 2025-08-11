// Test user authentication and API access
const testAuth = async () => {
  console.log('🔐 Testing authentication and user API...');
  
  try {
    // Test 1: Check if user exists through direct API call
    console.log('\n1️⃣ Testing user profile API...');
    const profileResponse = await fetch('http://localhost:3000/api/user/profile', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Profile API status:', profileResponse.status);
    const profileData = await profileResponse.text();
    console.log('Profile response:', profileData);
    
    // Test 2: Check NextAuth session endpoint
    console.log('\n2️⃣ Testing NextAuth session...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    console.log('Session API status:', sessionResponse.status);
    const sessionData = await sessionResponse.text();
    console.log('Session response:', sessionData);
    
    // Test 3: Check NextAuth providers
    console.log('\n3️⃣ Testing NextAuth providers...');
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers');
    console.log('Providers API status:', providersResponse.status);
    const providersData = await providersResponse.text();
    console.log('Providers response:', providersData);
    
  } catch (error) {
    console.error('❌ Error during auth testing:', error.message);
  }
};

testAuth();
