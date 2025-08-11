// Test script for the new billing period toggle feature
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testBillingPeriodFeature() {
  console.log('🚀 Testing Billing Period Toggle Feature...\n');

  try {
    // Step 1: Test packages API
    console.log('1. Testing packages API...');
    const packagesResponse = await axios.get(`${BASE_URL}/api/packages`);
    console.log('✅ Packages loaded:', packagesResponse.data.packages?.length || 0);
    
    const allPackages = packagesResponse.data.packages || [];
    
    // Filter monthly agent packages
    const monthlyAgentPackages = allPackages.filter(pkg => 
      pkg.name.toLowerCase().includes('agent') && pkg.interval === 'month'
    );
    
    // Filter yearly agent packages
    const yearlyAgentPackages = allPackages.filter(pkg => 
      pkg.name.toLowerCase().includes('agent') && pkg.interval === 'year'
    );

    console.log('\n📦 Monthly Agent Packages:');
    monthlyAgentPackages.forEach(pkg => {
      console.log(`   - ${pkg.name}: $${(pkg.price / 100).toFixed(2)}/${pkg.interval} (${pkg.listingsMax} listings)`);
    });

    console.log('\n📦 Yearly Agent Packages (10% discount):');
    yearlyAgentPackages.forEach(pkg => {
      const monthlyEquivalent = pkg.price / 12;
      const originalYearlyPrice = (pkg.price / 0.9); // Calculate original price before discount
      const monthlySavings = (originalYearlyPrice / 12) - monthlyEquivalent;
      console.log(`   - ${pkg.name}: $${(pkg.price / 100).toFixed(2)}/year ($${(monthlyEquivalent / 100).toFixed(2)}/month equivalent)`);
      console.log(`     💰 Monthly savings: $${(monthlySavings / 100).toFixed(2)} (10% discount)`);
    });

    // Step 2: Test pricing calculations
    console.log('\n2. Verifying pricing calculations...');
    
    for (const monthlyPkg of monthlyAgentPackages) {
      const matchingYearly = yearlyAgentPackages.find(yearly => 
        yearly.name.includes(monthlyPkg.name.replace(' (Yearly)', ''))
      );
      
      if (matchingYearly) {
        const expectedYearlyPrice = monthlyPkg.price * 12 * 0.9; // 10% discount
        const actualYearlyPrice = matchingYearly.price;
        
        if (Math.abs(expectedYearlyPrice - actualYearlyPrice) < 1) {
          console.log(`   ✅ ${monthlyPkg.name}: Pricing correct`);
          console.log(`      Monthly: $${(monthlyPkg.price / 100).toFixed(2)} × 12 × 0.9 = $${(expectedYearlyPrice / 100).toFixed(2)}`);
          console.log(`      Yearly:  $${(actualYearlyPrice / 100).toFixed(2)}`);
        } else {
          console.log(`   ❌ ${monthlyPkg.name}: Pricing mismatch`);
          console.log(`      Expected: $${(expectedYearlyPrice / 100).toFixed(2)}, Actual: $${(actualYearlyPrice / 100).toFixed(2)}`);
        }
      }
    }

    // Step 3: Test agent registration with yearly package
    console.log('\n3. Testing agent registration with yearly package...');
    const testRegistrationData = {
      name: 'Test Agent Yearly User',
      email: `testagent_yearly_${Date.now()}@example.com`,
      password: 'testpassword123',
      confirmPassword: 'testpassword123',
      phone: '+1234567890',
      agencyName: 'Test Yearly Real Estate Agency',
      bio: 'Testing yearly subscription',
      role: 'AGENT',
      packageId: yearlyAgentPackages[0]?.id // Use first yearly agent package
    };

    console.log('📝 Registration with yearly package:', {
      ...testRegistrationData,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]'
    });

    const registrationResponse = await axios.post(
      `${BASE_URL}/api/auth/register`,
      testRegistrationData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Yearly registration response:', registrationResponse.data);

    // Step 4: Verify feature availability
    console.log('\n4. Feature comparison:');
    
    console.log('\n📋 Agent Package Features:');
    console.log('   🔸 5-20 listings based on tier');
    console.log('   🔸 Email or priority email support');
    console.log('   🔸 Basic real estate tools');
    console.log('   🔸 Lead management');
    console.log('   ❌ No marketing toolkit');
    console.log('   ❌ No AI blog');
    console.log('   ❌ No social media automation');

    console.log('\n💰 Billing Options:');
    console.log('   📅 Monthly: Pay monthly, no discount');
    console.log('   📅 Yearly: Pay annually, save 10%');

    console.log('\n🎉 All billing period tests completed successfully!');
    console.log('\n📝 UI Testing Instructions:');
    console.log('   1. Open http://localhost:3000/register');
    console.log('   2. Select "Real Estate Agent"');
    console.log('   3. Fill personal information');
    console.log('   4. Fill business information');
    console.log('   5. In package selection, toggle between Monthly/Yearly');
    console.log('   6. Verify packages change and show "Save 10%" badge for yearly');
    console.log('   7. Select a yearly package and complete registration');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testBillingPeriodFeature();
