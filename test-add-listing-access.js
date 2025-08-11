// Test add-listing navigation and permissions
const testAddListingAccess = async () => {
  console.log('🧪 Testing add-listing page access...');
  
  try {
    // Test if add-listing page is accessible
    console.log('\n1️⃣ Testing add-listing page...');
    const response = await fetch('http://localhost:5544/add-listing', { redirect: 'manual' });
    console.log('Add-listing response status:', response.status);
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('Redirect location:', location);
      
      if (location && location.includes('insufficient-permissions')) {
        console.log('❌ Still getting permissions error');
      } else if (location && location.includes('/auth/login')) {
        console.log('🔐 Redirected to login (expected if not authenticated)');
      } else {
        console.log('🔄 Other redirect:', location);
      }
    } else if (response.status === 200) {
      console.log('✅ Add-listing page accessible');
    }
    
    // Test session endpoint to see current user role
    console.log('\n2️⃣ Checking current session...');
    const sessionResponse = await fetch('http://localhost:5544/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log('Current session:', sessionData);
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
};

testAddListingAccess();
