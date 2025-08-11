#!/usr/bin/env node

// Use curl for HTTP requests instead of fetch

async function testEditListing() {
  console.log('🧪 Testing Edit Listing Functionality...\n');

  const baseUrl = 'http://localhost:5544';
  const listingId = 'cme70an9q0001xbe8sftm5072';
  
  try {
    // Step 1: Test login to get session
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'me@p.pl',
        password: 'password123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    // Get cookies from login
    const cookies = loginResponse.headers.raw()['set-cookie'] || [];
    const cookieHeader = cookies.join('; ');
    console.log('Got cookies:', cookieHeader ? 'Yes' : 'No');

    // Step 2: Test fetching listing detail for edit
    console.log('\n2. Testing fetch listing for edit...');
    const detailResponse = await fetch(`${baseUrl}/api/listings/${listingId}`, {
      headers: {
        'Cookie': cookieHeader
      }
    });
    
    const detailData = await detailResponse.json();
    console.log('Detail fetch status:', detailResponse.status);
    console.log('Listing title:', detailData.listing?.title);
    console.log('Listing price:', detailData.listing?.price);

    // Step 3: Test updating the listing
    console.log('\n3. Testing PATCH update...');
    const updateData = {
      title: 'Updated Title - Test Edit',
      description: 'This listing has been updated via the edit functionality test',
      price: 125000,
      location: 'Updated Location, Miami, FL'
    };

    const updateResponse = await fetch(`${baseUrl}/api/listings/${listingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify(updateData)
    });

    console.log('Update response status:', updateResponse.status);
    
    if (updateResponse.ok) {
      const updatedData = await updateResponse.json();
      console.log('✅ Update successful!');
      console.log('New title:', updatedData.listing?.title);
      console.log('New price:', updatedData.listing?.price);
      console.log('New location:', updatedData.listing?.location);
    } else {
      const errorData = await updateResponse.text();
      console.log('❌ Update failed:', errorData);
    }

    // Step 4: Verify the changes persisted
    console.log('\n4. Verifying changes persisted...');
    const verifyResponse = await fetch(`${baseUrl}/api/listings/${listingId}`);
    const verifyData = await verifyResponse.json();
    
    console.log('Verification - Title:', verifyData.listing?.title);
    console.log('Verification - Price:', verifyData.listing?.price);
    console.log('Verification - Location:', verifyData.listing?.location);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEditListing();
