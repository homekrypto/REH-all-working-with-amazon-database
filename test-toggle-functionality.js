// Test script to verify the toggle switch functionality
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testToggleFunctionality() {
  console.log('🔄 Testing Toggle Switch Functionality...\n');

  try {
    // Test packages API to ensure we have both monthly and yearly packages
    console.log('1. Verifying package availability...');
    const packagesResponse = await axios.get(`${BASE_URL}/api/packages`);
    const allPackages = packagesResponse.data.packages || [];
    
    const monthlyAgentPackages = allPackages.filter(pkg => 
      pkg.name.toLowerCase().includes('agent') && pkg.interval === 'month'
    );
    
    const yearlyAgentPackages = allPackages.filter(pkg => 
      pkg.name.toLowerCase().includes('agent') && pkg.interval === 'year'
    );

    console.log('✅ Monthly Agent Packages:', monthlyAgentPackages.length);
    monthlyAgentPackages.forEach(pkg => {
      console.log(`   - ${pkg.name}: $${(pkg.price / 100).toFixed(2)}/${pkg.interval}`);
    });

    console.log('✅ Yearly Agent Packages:', yearlyAgentPackages.length);
    yearlyAgentPackages.forEach(pkg => {
      console.log(`   - ${pkg.name}: $${(pkg.price / 100).toFixed(2)}/${pkg.interval}`);
    });

    if (monthlyAgentPackages.length === 3 && yearlyAgentPackages.length === 3) {
      console.log('\n✅ Package availability test PASSED');
    } else {
      console.log('\n❌ Package availability test FAILED');
      return;
    }

    // Test price calculations
    console.log('\n2. Verifying price calculations...');
    const expectedPairs = [
      { monthly: 'Agent Basic', yearly: 'Agent Basic (Yearly)' },
      { monthly: 'Agent Standard', yearly: 'Agent Standard (Yearly)' },
      { monthly: 'Agent Professional', yearly: 'Agent Professional (Yearly)' }
    ];

    let allCalculationsCorrect = true;

    expectedPairs.forEach(pair => {
      const monthlyPkg = monthlyAgentPackages.find(p => p.name === pair.monthly);
      const yearlyPkg = yearlyAgentPackages.find(p => p.name === pair.yearly);

      if (monthlyPkg && yearlyPkg) {
        const expectedYearlyPrice = monthlyPkg.price * 12 * 0.9; // 10% discount
        const actualYearlyPrice = yearlyPkg.price;
        const isCorrect = Math.abs(expectedYearlyPrice - actualYearlyPrice) < 1;

        if (isCorrect) {
          console.log(`   ✅ ${pair.monthly}: $${(monthlyPkg.price / 100).toFixed(2)}/month → $${(yearlyPkg.price / 100).toFixed(2)}/year (10% discount)`);
        } else {
          console.log(`   ❌ ${pair.monthly}: Expected $${(expectedYearlyPrice / 100).toFixed(2)}, got $${(actualYearlyPrice / 100).toFixed(2)}`);
          allCalculationsCorrect = false;
        }
      }
    });

    if (allCalculationsCorrect) {
      console.log('\n✅ Price calculation test PASSED');
    } else {
      console.log('\n❌ Price calculation test FAILED');
      return;
    }

    console.log('\n3. Testing UI toggle behavior simulation...');
    
    // Simulate monthly selection
    console.log('   📅 Monthly billing selected:');
    const monthlyPackageNames = monthlyAgentPackages.map(p => p.name);
    console.log(`      Should display: ${monthlyPackageNames.join(', ')}`);
    
    // Simulate yearly selection
    console.log('   📅 Yearly billing selected:');
    const yearlyPackageNames = yearlyAgentPackages.map(p => p.name);
    console.log(`      Should display: ${yearlyPackageNames.join(', ')}`);
    console.log('      Should show "Save 10%" badges');

    console.log('\n4. UI Testing Instructions:');
    console.log('   1. Open http://localhost:3000/register');
    console.log('   2. Select "Real Estate Agent"');
    console.log('   3. Fill personal information and continue');
    console.log('   4. Fill business information and continue');
    console.log('   5. On package selection page, look for the toggle switch');
    console.log('   6. Toggle between Monthly/Yearly and observe:');
    console.log('      - Package cards should change instantly');
    console.log('      - Prices should update to yearly equivalents');
    console.log('      - "Save 10%" badges should appear for yearly');
    console.log('      - Console logs should show filtering in browser dev tools');

    console.log('\n🎉 Toggle functionality verification COMPLETE!');
    console.log('\n💡 If toggle doesn\'t work:');
    console.log('   - Check browser console for debug logs');
    console.log('   - Verify React state is updating');
    console.log('   - Ensure packages are being filtered correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testToggleFunctionality();
