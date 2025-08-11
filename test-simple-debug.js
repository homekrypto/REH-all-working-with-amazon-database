// Simple test to check login flow and dashboard access
const testLogin = async () => {
  console.log('🧪 Testing login flow and dashboard access...');
  
  try {
    // Test 1: Check if dashboard page exists
    console.log('\n1️⃣ Testing dashboard page accessibility...');
    const dashboardResponse = await fetch('http://localhost:3000/dashboard');
    console.log('Dashboard response status:', dashboardResponse.status);
    
    if (dashboardResponse.status === 404) {
      console.log('❌ Dashboard returns 404 - this might be the issue!');
    } else {
      console.log('✅ Dashboard page exists');
    }
    
    // Test 2: Check if login page exists
    console.log('\n2️⃣ Testing login page accessibility...');
    const loginResponse = await fetch('http://localhost:3000/auth/login');
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.status === 404) {
      console.log('❌ Login page returns 404');
    } else {
      console.log('✅ Login page exists');
    }
    
    // Test 3: Check root page
    console.log('\n3️⃣ Testing root page...');
    const rootResponse = await fetch('http://localhost:3000/');
    console.log('Root response status:', rootResponse.status);
    
    // Test 4: Check if API routes work
    console.log('\n4️⃣ Testing API health...');
    const apiResponse = await fetch('http://localhost:3000/api/health');
    console.log('API health response status:', apiResponse.status);
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }
};

testLogin();
