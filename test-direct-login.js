// Test login API directly
const testDirectLogin = async () => {
  console.log('🔑 Testing direct login API...');
  
  try {
    // Test login API with the test user credentials
    console.log('\n1️⃣ Testing login API with test credentials...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'me@p.pl',
        password: 'testpassword123',
        callbackUrl: '/dashboard'
      })
    });
    
    console.log('Login API status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    // Check if there's a redirect
    if (loginResponse.status === 302) {
      console.log('✅ Login redirect detected (expected)');
      console.log('Redirect location:', loginResponse.headers.get('location'));
    }
    
    // Test 2: Try the credentials endpoint directly
    console.log('\n2️⃣ Testing signin endpoint...');
    const signinResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'me@p.pl',
        password: 'testpassword123',
        redirect: false
      })
    });
    
    console.log('Signin API status:', signinResponse.status);
    const signinData = await signinResponse.text();
    console.log('Signin response:', signinData);
    
  } catch (error) {
    console.error('❌ Error during login testing:', error.message);
  }
};

testDirectLogin();
