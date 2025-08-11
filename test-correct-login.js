// Test using the correct NextAuth signin endpoint
const testCorrectLogin = async () => {
  console.log('🧪 Testing correct NextAuth signin...');
  
  try {
    // Use the signin endpoint that next-auth expects
    console.log('\n1️⃣ Testing signin/credentials endpoint...');
    
    const formData = new URLSearchParams({
      email: 'me@p.pl',
      password: 'testpassword123',
      callbackUrl: '/dashboard',
      redirect: 'false'
    });
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      redirect: 'manual'
    });
    
    console.log('Signin response status:', loginResponse.status);
    console.log('Signin response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.status === 302) {
      const location = loginResponse.headers.get('location');
      console.log('Redirect location:', location);
      
      if (location && location.includes('/dashboard')) {
        console.log('✅ Successful redirect to dashboard');
      } else if (location && location.includes('/login')) {
        console.log('❌ Redirected back to login - authentication failed');
      } else {
        console.log('🔄 Other redirect:', location);
      }
    }
    
    // Test response body
    const responseText = await loginResponse.text();
    console.log('Response body preview:', responseText.substring(0, 200));
    
  } catch (error) {
    console.error('❌ Error during correct login test:', error.message);
  }
};

testCorrectLogin();
