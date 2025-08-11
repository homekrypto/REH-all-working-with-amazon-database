// Manual login test through fetch
const testManualLogin = async () => {
  console.log('🧪 Testing manual login...');
  
  try {
    // First get CSRF token
    console.log('\n1️⃣ Getting CSRF token...');
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('CSRF token:', csrfData.csrfToken);
    
    // Try login with CSRF token
    console.log('\n2️⃣ Attempting login with CSRF...');
    const loginData = new FormData();
    loginData.append('email', 'me@p.pl');
    loginData.append('password', 'testpassword123');
    loginData.append('csrfToken', csrfData.csrfToken);
    loginData.append('callbackUrl', '/dashboard');
    loginData.append('json', 'true');
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      body: loginData,
      redirect: 'manual'
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.status === 302) {
      console.log('✅ Login redirect detected');
      const location = loginResponse.headers.get('location');
      console.log('Redirect location:', location);
      
      if (location && location.includes('/dashboard')) {
        console.log('✅ Successful redirect to dashboard');
      } else if (location && location.includes('/login')) {
        console.log('❌ Redirected back to login - authentication failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during manual login test:', error.message);
  }
};

testManualLogin();
